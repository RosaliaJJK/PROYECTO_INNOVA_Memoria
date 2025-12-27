// --- RUTAS DE RECUPERACIÓN DE CONTRASEÑA ---

// 1. Mostrar la página de recuperación
app.get('/recuperar-contrasena', (req, res) => {
    res.render('recuperar-contrasena');
});

// 2. Procesar la solicitud de recuperación
app.post('/auth/forgot-password', (req, res) => {
    const { email } = req.body;

    // Verificar si el correo existe en la base de datos
    const query = 'SELECT * FROM usuarios WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err) return res.status(500).send("Error en el servidor");

        if (results.length > 0) {
            const user = results[0];
            
            // En un sistema real, aquí generarías un token único y lo guardarías en la BD
            // Por ahora, simularemos el envío de un enlace seguro
            const enlaceRecuperacion = `http://localhost:3000/restablecer/${user.id}`;

            const mensaje = `
                Hola ${user.nombre},
                Has solicitado restablecer tu contraseña en INNOVA SIGET.
                Haz clic en el siguiente enlace para continuar:
                ${enlaceRecuperacion}
                
                Si no solicitaste esto, ignora este correo.
            `;

            enviarNotificacion(email, 'Restablecer Contraseña - INNOVA SIGET', mensaje);

            res.send(`
                <script>
                    alert('Se han enviado instrucciones a tu correo institucional.');
                    window.location.href = '/';
                </script>
            `);
        } else {
            // Por seguridad, es mejor no confirmar si el correo existe o no
            res.send(`
                <script>
                    alert('Si el correo está registrado, recibirás un mensaje pronto.');
                    window.location.href = '/';
                </script>
            `);
        }
    });
});