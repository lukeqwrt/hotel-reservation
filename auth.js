
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    // get user info
    const email = signupForm['signup-email'].value;
    const password = signupForm['signup-password'].value;

    // sign up the user
    auth.createUserWithEmailAndPassword(email, password).then(cred => {
     //   const modal = document.querySelector('#modal-signup')
     $('#modal-signup').modal('hide')
     return db.collection('Reservation').doc(cred.user.uid)     
     signupForm.reset()

    }).then(() => {
        signupForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        signupForm.querySelector('.error').innerHTML = err.message;
    })
});

//logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
    // e.preventDefault();
    auth.signOut();
    // console.log('logged out')
})

// login
const loginForm = document.querySelector('#login-form')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    //get user info
    const email = loginForm['login-email'].value;
    const password = loginForm['login-password'].value;
    signupForm.querySelector('.error').innerHTML = '';
    auth.signInWithEmailAndPassword(email, password).then(cred => {
       // console.log(cred.user)
       loginForm.querySelector('.error').innerHTML = '';
    }).then(() => {
        $('#loginmodal').modal('hide')
        loginForm.querySelector('.error').innerHTML = '';
    }).catch(err => {
        loginForm.querySelector('.error').innerHTML = err.message;
    })

})