const { comprobarJWT } = require('../helpers/jwt');
const { io } = require('../index');
const {usuarioConectado,usuarioDesconectado, grabarMensaje} = require('../controllers/socket');
const usuario = require('../models/usuario');

// Mensajes de Sockets
io.on('connection', (client) => {
    console.log('Cliente conectado');

    console.log(client.handshake.headers['x-token']); 
    const [valido,uid] = comprobarJWT (client.handshake.headers['x-token'])
    console.log(valido,uid);

    //verificar autenticacion
    if (!valido){ return client.disconnect(); }

    //Cliente autenticado
    usuarioConectado(uid);

    //Ingrese al usuario a una sala en particular
    //sala global, client.id,
    client.join(uid);

    //Escuchar del cliente el mensaje personal
    client.on('mensaje-personal', async(payload) => {
        await grabarMensaje (payload);
        io.to( payload.para ).emit('mensaje-personal',payload );

    })

    client.on('disconnect', () => {
        console.log('Cliente desconectado');
        usuarioDesconectado(uid);
    });

/*     client.on('mensaje', ( payload ) => {
        console.log('Mensaje', payload);

        io.emit( 'mensaje', { admin: 'Nuevo mensaje' } );

    });
 */

});
