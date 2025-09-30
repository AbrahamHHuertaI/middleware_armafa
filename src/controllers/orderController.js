const axios = require('axios');
const nodemailer = require('nodemailer');

class OrderController {
  constructor() {
    this.directusUrl = process.env.DIRECTUS_URL;
    this.webhookToken = process.env.WEBHOOK_TOKEN;
    
    // Configurar transporter para nodemailer
    this.transporter = this.crearTransporter();
  }

  /**
   * Crear transporter de nodemailer con configuración apropiada
   */
  crearTransporter() {
    const config = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    };

    // En desarrollo, ignorar certificados SSL problemáticos
    if (process.env.NODE_ENV !== 'production') {
      config.tls = {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
      };
    } else {
      config.tls = {
        rejectUnauthorized: process.env.SMTP_IGNORE_TLS !== 'true'
      };
    }

    return nodemailer.createTransport(config);
  }

  /**
   * Verificar conexión SMTP
   */
  async verificarConexionSMTP() {
    try {
      await this.transporter.verify();
      console.log('✅ Conexión SMTP verificada correctamente');
      return true;
    } catch (error) {
      console.error('❌ Error verificando conexión SMTP:', error.message);
      return false;
    }
  }

  /**
   * Normalizar payload para manejar diferentes formatos de entrada
   */
  normalizarPayload(body) {
    // Caso 1: Body viene como objeto normal
    if (body && typeof body === 'object' && body.id) {
      return body;
    }

    // Caso 2: Body viene como objeto con claves que contienen JSON strings
    if (body && typeof body === 'object') {
      const keys = Object.keys(body);
      
      // Buscar una clave que contenga un JSON string
      for (const key of keys) {
        try {
          // Intentar parsear la clave como JSON
          const parsedKey = JSON.parse(key);
          if (parsedKey && typeof parsedKey === 'object') {
            // Si la clave es un objeto, usar ese objeto como payload
            return parsedKey;
          }
        } catch (e) {
          // Si no se puede parsear la clave, continuar
        }
      }

      // Si no encontramos una clave parseable, buscar valores que sean objetos
      for (const key of keys) {
        const value = body[key];
        if (value && typeof value === 'object' && value.id) {
          return value;
        }
      }
    }

    // Caso 3: Body es un string JSON
    if (typeof body === 'string') {
      try {
        return JSON.parse(body);
      } catch (e) {
        console.error('Error parseando body como JSON string:', e);
      }
    }

    // Si no se puede normalizar, devolver el body original
    return body;
  }

  /**
   * Procesar nuevo pedido desde webhook
   */
  processOrder = async (req, res, next) => {
    try {
      let payload = req.body;
      console.log('Body recibido:', payload);

      // Manejar diferentes formatos de entrada
      payload = this.normalizarPayload(payload);

      // Validar que el payload existe
      if (!payload) {
        return res.status(400).json({
          error: 'Payload requerido',
          message: 'El payload es obligatorio'
        });
      }

      console.log('Payload normalizado:', payload);

      // Verificar conexión SMTP antes de procesar
      const smtpOk = await this.verificarConexionSMTP();
      if (!smtpOk) {
        console.warn('⚠️ Advertencia: Conexión SMTP no verificada, pero continuando...');
      }

      // 1. Obtener y formatear productos del payload
      const productos = this.parseProductos(payload.Productos);
      
      // 2. Obtener información del cliente
      const clienteInfo = this.extractClienteInfo(payload);

      // 3. Obtener información completa de productos desde Directus
      const productosCompletos = await this.obtenerProductosDirectus(productos);

      // 4. Agrupar productos por proveedor
      const productosPorProveedor = this.agruparPorProveedor(productosCompletos);

      // 5. Enviar correos a cada proveedor
      const resultadosCorreos = await this.enviarCorreosProveedores(
        productosPorProveedor, 
        clienteInfo, 
        payload
      );

      res.status(200).json({
        success: true,
        message: 'Pedido procesado exitosamente',
        data: {
          cliente: clienteInfo,
          productos: productosCompletos,
          correosEnviados: resultadosCorreos
        }
      });

    } catch (error) {
      console.error('Error procesando pedido:', error);
      next(error);
    }
  };

  /**
   * Parsear productos del JSON string del payload
   */
  parseProductos(productosString) {
    try {
      if (!productosString) {
        throw new Error('Productos no encontrados en el payload');
      }

      const productos = JSON.parse(productosString);
      
      if (!Array.isArray(productos)) {
        throw new Error('Los productos deben ser un array');
      }

      return productos;
    } catch (error) {
      throw new Error(`Error parseando productos: ${error.message}`);
    }
  }

  /**
   * Extraer información del cliente del payload
   */
  extractClienteInfo(payload) {
    return {
      usuario: payload.Usuario,
      nombre: payload.Nombre,
      apellidos: payload.Apellidos,
      email: payload.Email,
      telefono: payload.Telefono,
      direccion: payload.Direccion,
      ciudad: payload.Ciudad,
      estado: payload.Estado,
      codigoPostal: payload.Codigo_Postal,
      referencias: payload.Referencias
    };
  }

  /**
   * Obtener información completa de productos desde Directus
   */
  async obtenerProductosDirectus(productos) {
    try {
      const productosCompletos = [];

      for (const producto of productos) {
        try {
          // Hacer llamada a Directus para obtener el producto con su proveedor y usuario asociado
          const response = await axios.get(
            `${this.directusUrl}/items/Productos/${producto.id}?fields=*,Proveedor.*,Proveedor.Usuario_asociado.*`,
            {
              headers: {
                'Authorization': `Bearer ${this.webhookToken}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const productoCompleto = {
            ...producto,
            ...response.data.data,
            proveedor: response.data.data.Proveedor
          };

          productosCompletos.push(productoCompleto);
        } catch (error) {
          console.error(`Error obteniendo producto ${producto.id}:`, error.message);
          // Agregar producto sin información de proveedor si falla la consulta
          productosCompletos.push({
            ...producto,
            proveedor: null,
            error: 'No se pudo obtener información del proveedor'
          });
        }
      }

      return productosCompletos;
    } catch (error) {
      throw new Error(`Error obteniendo productos de Directus: ${error.message}`);
    }
  }

  /**
   * Agrupar productos por proveedor
   */
  agruparPorProveedor(productosCompletos) {
    const grupos = {};

    productosCompletos.forEach(producto => {
      if (producto.proveedor && producto.proveedor.id) {
        const proveedorId = producto.proveedor.id;
        
        if (!grupos[proveedorId]) {
          grupos[proveedorId] = {
            proveedor: producto.proveedor,
            productos: []
          };
        }
        
        grupos[proveedorId].productos.push(producto);
      }
    });

    return grupos;
  }

  /**
   * Enviar correos a proveedores
   */
  async enviarCorreosProveedores(productosPorProveedor, clienteInfo, payload) {
    const resultados = [];

    for (const [proveedorId, grupo] of Object.entries(productosPorProveedor)) {
      try {
        const proveedor = grupo.proveedor;
        
        // Obtener email del usuario asociado al proveedor
        const usuarioAsociado = proveedor.Usuario_asociado;
        const emailProveedor = usuarioAsociado?.email || proveedor.email;
        
        // Verificar que el proveedor tenga email (del usuario asociado o del proveedor)
        if (!emailProveedor) {
          resultados.push({
            proveedorId,
            proveedorNombre: proveedor.Nombre_comercial || proveedor.Razon_social || 'Sin nombre',
            exito: false,
            error: 'Proveedor sin email configurado'
          });
          continue;
        }

        // Crear contenido del correo
        const emailContent = this.crearContenidoCorreo(
          proveedor, 
          grupo.productos, 
          clienteInfo, 
          payload
        );

        // Enviar correo
        const info = await this.transporter.sendMail({
          from: process.env.SMTP_FROM || process.env.SMTP_USER,
          to: emailProveedor,
          subject: `Nuevo Pedido - ${payload.NoOrden}`,
          html: emailContent.html,
          text: emailContent.text
        });

        resultados.push({
          proveedorId,
          proveedorNombre: proveedor.Nombre_comercial || proveedor.Razon_social || 'Sin nombre',
          proveedorEmail: emailProveedor,
          usuarioAsociado: usuarioAsociado?.first_name && usuarioAsociado?.last_name 
            ? `${usuarioAsociado.first_name} ${usuarioAsociado.last_name}` 
            : usuarioAsociado?.email || 'Sin información',
          exito: true,
          messageId: info.messageId
        });

      } catch (error) {
        console.error(`Error enviando correo a proveedor ${proveedorId}:`, error);
        resultados.push({
          proveedorId,
          proveedorNombre: grupo.proveedor.Nombre_comercial || grupo.proveedor.Razon_social || 'Sin nombre',
          exito: false,
          error: error.message
        });
      }
    }

    return resultados;
  }

  /**
   * Crear contenido del correo para proveedor con estilo de carrito
   */
  crearContenidoCorreo(proveedor, productos, clienteInfo, payload) {
    const usuarioAsociado = proveedor.Usuario_asociado;
    const nombreUsuario = usuarioAsociado?.first_name && usuarioAsociado?.last_name 
      ? `${usuarioAsociado.first_name} ${usuarioAsociado.last_name}` 
      : usuarioAsociado?.email || 'Usuario asociado';
    
    // Calcular total de productos del proveedor
    const totalProveedor = productos.reduce((sum, p) => sum + (p.total || p.precioUnitario * p.cantidad), 0);
    
    // Crear filas de productos
    const filasProductos = productos.map(p => `
      <tr style="border-bottom: 1px solid #e0e0e0;">
        <td style="padding: 15px; text-align: center;">
          <div style="width: 60px; height: 60px; background-color: #f8f9fa; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin: 0 auto;">
            <span style="color: #666; font-size: 12px;">IMG</span>
          </div>
        </td>
        <td style="padding: 15px;">
          <div style="font-weight: 600; color: #333; margin-bottom: 5px;">${p.nombre}</div>
          <div style="color: #666; font-size: 14px;">Proveedor: ${proveedor.Nombre_comercial || proveedor.Razon_social}</div>
        </td>
        <td style="padding: 15px; text-align: right; color: #333; font-weight: 600;">
          $${p.precioUnitario.toFixed(2)}
        </td>
        <td style="padding: 15px; text-align: center;">
          <div style="display: inline-flex; align-items: center; background-color: #f8f9fa; border-radius: 6px; padding: 5px 10px;">
            <span style="color: #333; font-weight: 600;">${p.cantidad}</span>
          </div>
        </td>
        <td style="padding: 15px; text-align: right; color: #333; font-weight: 600;">
          $${(p.total || p.precioUnitario * p.cantidad).toFixed(2)}
        </td>
      </tr>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Nuevo Pedido - ${payload.NoOrden}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
        <div style="max-width: 800px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 600;">Nuevo Pedido Recibido</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Estimado/a ${nombreUsuario}</p>
          </div>

          <!-- Breadcrumb -->
          <div style="padding: 20px 30px 0 30px;">
            <div style="color: #666; font-size: 14px;">
              <span>Home</span> > <span style="color: #333; font-weight: 600;">Carrito de compras</span>
            </div>
          </div>

          <!-- Order Info -->
          <div style="padding: 20px 30px;">
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
              <h2 style="color: #333; margin: 0 0 15px 0; font-size: 20px;">Información del Pedido</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div><strong>Número de Orden:</strong> ${payload.NoOrden}</div>
                <div><strong>Estatus:</strong> ${payload.Estatus}</div>
                <div><strong>Subtotal:</strong> $${payload.Subtotal}</div>
                <div><strong>IVA:</strong> $${payload.IVA}</div>
                <div style="grid-column: 1 / -1; font-size: 18px; font-weight: 600; color: #333; border-top: 1px solid #ddd; padding-top: 15px; margin-top: 10px;">
                  <strong>Total:</strong> $${payload.Total}
                </div>
              </div>
            </div>
          </div>

          <!-- Products Table -->
          <div style="padding: 0 30px 20px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Productos de su Proveedor</h2>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <thead>
                  <tr style="background-color: #f8f9fa;">
                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #e0e0e0;">Imagen</th>
                    <th style="padding: 15px; text-align: left; font-weight: 600; color: #333; border-bottom: 2px solid #e0e0e0;">Producto</th>
                    <th style="padding: 15px; text-align: right; font-weight: 600; color: #333; border-bottom: 2px solid #e0e0e0;">Precio</th>
                    <th style="padding: 15px; text-align: center; font-weight: 600; color: #333; border-bottom: 2px solid #e0e0e0;">Cantidad</th>
                    <th style="padding: 15px; text-align: right; font-weight: 600; color: #333; border-bottom: 2px solid #e0e0e0;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${filasProductos}
                </tbody>
                <tfoot>
                  <tr style="background-color: #f8f9fa; border-top: 2px solid #e0e0e0;">
                    <td colspan="4" style="padding: 20px 15px; text-align: right; font-weight: 600; color: #333; font-size: 16px;">Total Proveedor:</td>
                    <td style="padding: 20px 15px; text-align: right; font-weight: 600; color: #333; font-size: 18px;">$${totalProveedor.toFixed(2)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <!-- Customer Info -->
          <div style="padding: 0 30px 20px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 20px;">Información del Cliente</h2>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 12px;">
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div><strong>Nombre:</strong> ${clienteInfo.nombre} ${clienteInfo.apellidos}</div>
                <div><strong>Email:</strong> ${clienteInfo.email}</div>
                <div><strong>Teléfono:</strong> ${clienteInfo.telefono}</div>
                <div><strong>Ciudad:</strong> ${clienteInfo.ciudad}, ${clienteInfo.estado}</div>
                <div style="grid-column: 1 / -1;"><strong>Dirección:</strong> ${clienteInfo.direccion}</div>
                <div><strong>Código Postal:</strong> ${clienteInfo.codigoPostal}</div>
                ${clienteInfo.referencias ? `<div style="grid-column: 1 / -1;"><strong>Referencias:</strong> ${clienteInfo.referencias}</div>` : ''}
              </div>
            </div>
          </div>

          <!-- Info Banner -->
          <div style="padding: 0 30px 30px 30px;">
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 12px; padding: 20px;">
              <div style="display: flex; align-items: flex-start;">
                <div style="background-color: #f39c12; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; margin-right: 15px; flex-shrink: 0; font-size: 14px; font-weight: bold;">i</div>
                <div style="color: #856404; line-height: 1.5;">
                  <strong>Información importante:</strong> Tu pedido incluye productos de distintos proveedores. Por esta razón, los tiempos de entrega y el tipo de embalaje pueden variar, ya que cada proveedor es responsable del armado y envío de sus productos. Recibirás información de envío por separado para cada proveedor.
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div style="background-color: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #e0e0e0;">
            <p style="color: #666; margin: 0; font-size: 14px;">
              Este correo fue generado automáticamente por el sistema de pedidos.
            </p>
            <p style="color: #999; margin: 10px 0 0 0; font-size: 12px;">
              ${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
Nuevo Pedido Recibido

Estimado/a ${nombreUsuario},

Información del Pedido:
- Número de Orden: ${payload.NoOrden}
- Total: $${payload.Total}
- Subtotal: $${payload.Subtotal}
- IVA: $${payload.IVA}
- Estatus: ${payload.Estatus}

Productos de su Proveedor:
${productos.map(p => `- ${p.nombre} (Cantidad: ${p.cantidad}, Precio: $${p.precioUnitario}, Total: $${(p.total || p.precioUnitario * p.cantidad).toFixed(2)})`).join('\n')}

Total Proveedor: $${totalProveedor.toFixed(2)}

Información del Cliente:
- Nombre: ${clienteInfo.nombre} ${clienteInfo.apellidos}
- Email: ${clienteInfo.email}
- Teléfono: ${clienteInfo.telefono}
- Dirección: ${clienteInfo.direccion}
- Ciudad: ${clienteInfo.ciudad}, ${clienteInfo.estado}
- Código Postal: ${clienteInfo.codigoPostal}
${clienteInfo.referencias ? `- Referencias: ${clienteInfo.referencias}` : ''}

Información importante: Tu pedido incluye productos de distintos proveedores. Por esta razón, los tiempos de entrega y el tipo de embalaje pueden variar, ya que cada proveedor es responsable del armado y envío de sus productos. Recibirás información de envío por separado para cada proveedor.

Este correo fue generado automáticamente por el sistema de pedidos.
${new Date().toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
    `;

    return { html, text };
  }
}

module.exports = new OrderController();
