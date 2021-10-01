const signupForm = document.querySelector("#signup-form");


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