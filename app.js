const reservation = document.querySelector('#reservation-list');
const form = document.querySelector('#add-reservation-form');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

const setupUi = (user) => {
    if(user){
        //account info
        const html = `
            <div>Logged in as  ${user.email}</div>
        `;
        accountDetails.innerHTML = html;

        //toggle ui elements
        loggedInLinks.forEach(item => item.style.display = "block");
        loggedOutLinks.forEach(item => item.style.display = "none");
   

    }else{
        //hide acc info 
        accountDetails.innerHTML = '';

        //toggle ui elements
        loggedInLinks.forEach(item => item.style.display = "none");
        loggedOutLinks.forEach(item => item.style.display = "block");
    }
}

// create element and render reservation
function renderReservation(doc){
    let li = document.createElement('li');
    let checkin = document.createElement('span');
    let checkout = document.createElement('span');
    let rooms = document.createElement('span');
    let adult = document.createElement('span');
    let children = document.createElement('span');
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    checkin.textContent = `checkin: ${doc.data().checkin}`;
    checkout.textContent = `checkout: ${doc.data().checkout}`;
    rooms.textContent = `Rooms: ${doc.data().rooms}`;
    adult.textContent = `adult: ${doc.data().adults}`;
    children.textContent = `children: ${doc.data().children}`;
    cross.textContent = 'X';
    cross.classList.add('close')

    li.appendChild(checkin)
    li.appendChild(checkout)
    li.appendChild(rooms)
    li.appendChild(adult)
    li.appendChild(children)
    li.appendChild(cross)

    reservation.appendChild(li)

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('Reservation').doc(id).delete();
    })

}

// get data


// db.collection('Reservation').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderReservation(doc)
//     })
// })


// insert


const signupError = document.querySelector(".error-signup")
//listen for all auth status changes
auth.onAuthStateChanged(user => {
    if(user){
            //    console.log(user.uid)
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    window.sessionStorage.setItem( 'hotelreservation-cached', JSON.stringify({
                        checkin: form.checkin.value,
                        checkout: form.checkout.value,
                        rooms: form.rooms.value,
                        adults: form.adults.value,
                        children: form.children.value,
                        userId: user.uid,
                        uniqueResDocs: 'show'
                    }));
                    $('#loginmodal').modal('hide')
                    form.checkin.value = '';
                    form.checkout.value = '';
                    form.rooms.value = '';
                    form.adults.value = '';
                    form.children.value = '';
                    window.location.href = "/rooms.html"
                })
                
            //    realtime listener
                // db.collection('Reservation').onSnapshot(snapshot => {
                //     let changes = snapshot.docChanges();
                //   console.log(changes[changes.length - 1])
                //     changes.forEach(change => {
                //         console.log(changes[changes.length - 1].doc.id)
                //         if(change.doc.id == changes[changes.length - 1].doc.id){
                            
                //             renderReservation(change.doc)
                //         }else if(change.type == 'removed'){
                //             let li = reservation.querySelector('[data-id=' + change.doc.id + ']')
                //             reservation.removeChild(li);
                //         }
                //     })
                // })


                // db.collection('Reservation').onSnapshot(snapshot => {
                //     let changes = snapshot.docChanges();
                //  //   console.log(changes)
                //     changes.forEach(change => {
                //         if(change.type == 'added'){
                //             renderReservation(change.doc)
                //         }else if(change.type == 'removed'){
                //             let li = reservation.querySelector('[data-id=' + change.doc.id + ']')
                //             reservation.removeChild(li);
                //         }
                //     })
                // })
    //    console.log('user logged in: ', user)
        setupUi(user)

 
    }
    else{
        form.addEventListener('submit', (e) => {
            e.preventDefault();
     
            $('#loginmodal').modal('show')
        })
        setupUi();
              // realtime listener
         
    }
})

function goToSecton(section){
    let el = document.getElementById(section);
    let elTop = el.offsetTop - 48;
    window.scroll({
        top: elTop,
        behavior: "smooth"
    })
  }
  

