auth.onAuthStateChanged( user => {
    if(user){

        db.collection('platillos').onSnapshot(snapshot =>{
            obtienePlatillos(snapshot.docs);
        });
        configurarMenu(user);
    }

    else{
        obtienePlatillos([]);
        configurarMenu();
    }
});

const formaingresar = document.getElementById('formaingresar');

formaingresar.addEventListener('submit', (e)=>{
    e.preventDefault();

    let correo = formaingresar['correo'].value;
    let contrasena = formaingresar['contrasena'].value;

    auth.signInWithEmailAndPassword(correo,contrasena).then( cred => {
        console.log(cred)

        $('#ingresarmodal').modal('hide');
        formaingresar.reset();
        formaingresar.querySelector('.error').innerHTML='';

    }).catch(err => {
        formaingresar.querySelector('.error').innerHTML=mensajeError(err.code);
        console.log(err)
    });
});


function mensajeError(codigo){
    let mensaje = '';
    switch(codigo){
        case 'auth/wrong-password':
            mensaje = 'Su contraseña no es correcta'
            break;

        case 'auth/user-not-found':
            mensaje = 'Usuario no encontrado'
            break;

        case 'auth/weak-password':
            mensaje = 'Contraseña Debil'
            break;
        default:
            mensaje = 'Ocurrio un error al ingresar con este usuario'
    }

    return mensaje;
}

const salir = document.getElementById('salir');

salir.addEventListener('click', (e) =>{

e.preventDefault();
auth.signOut().then(() => {
    alert('El usuario cerro sesion');
});

});


const formaregistrarte = document.getElementById('formaregistrate');

formaregistrarte.addEventListener('submit', (e)=>{
    e.preventDefault();
    
    const correo = formaregistrarte['rcorreo'].value;
    const contrasena = formaregistrarte['rcontrasena'].value;

    auth.createUserWithEmailAndPassword(correo,contrasena).then(cred =>{
       
       return db.collection('usuarios').doc(cred.user.uid).set({
            nombre: formaregistrarte['rnombre'].value,
            telefono:formaregistrarte['rtelefono'].value,
            direccion:formaregistrarte['rdireccion'].value
        });

        
    }).then(()=>{
        $('#registratemodal').modal('hide');
        formaregistrarte.reset();
        formaregistrarte.querySelector('.error').innerHTML = '';

    }).catch(err => {
        formaregistrarte.querySelector('.error').innerHTML = mensajeError(erro);

    });;
    
})


entrarGoogle = () =>{
    var provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider).then(function(result){
        var token = result.credential.accessToken;
        console.log(token);

        var user = result.user;

        let html = `
            <p>Nombre: ${user.displayName} </p>
            <p>Correo: ${user.email} </p>
            <img src="${user.photoURL}">
        `;

        datosdelacuenta.innerHTML = html;
        $('#ingresarmodal').modal('hide');
        formaingresar.reset();
        formaingresar.querySelector('.error').innerHTML = '';
    }).catch( function(error){
            console.log(error);
    });
}