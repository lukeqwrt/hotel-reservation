const reservation = document.querySelector('#reservation-list');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const confirmForm = document.querySelector('#confirmForm')
window.addEventListener('load', () => {
    const loader =  document.querySelector('.loader');
    loader.classList.add("hidden")
})
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
function renderReservation(doc){
    let li = document.createElement('li');
    let checkin = document.createElement('div');
    let checkout = document.createElement('div');
    let rooms = document.createElement('div');
    let adult = document.createElement('div');
    let children = document.createElement('div');
    let roomName = document.createElement('div');
    let roomPrice = document.createElement('div');
    let totalCharges = document.createElement('div');
    let cross = document.createElement('div');
    const dayratesTotal = doc.dayRates * parseInt(doc.price.substring(1), 10)
    totalCharges.classList.add('totalCharges-wrapper')
    let totalChargesContent = `
        <div>Total Charges</div>
        <p>₱${dayratesTotal}</p>
    `
    let cached = JSON.parse(window.sessionStorage.getItem('hotelreservation-cached'));
    cached.totalCharges = dayratesTotal
    window.sessionStorage.setItem('hotelreservation-cached', JSON.stringify(cached))

    li.setAttribute('data-id', doc.id);
    checkin.textContent = `Checkin: ${doc.checkin}`;
    checkout.textContent = `Checkout: ${doc.checkout}`;
    rooms.textContent = `Rooms: ${doc.rooms}`;
    adult.textContent = `Adult: ${doc.adults}`;
    children.textContent = `Children: ${doc.children}`;
    roomName.textContent = `Your room: ${doc.CustomeRooms}`;
    roomPrice.textContent = `Room price: ${doc.price}`;
    totalCharges.innerHTML = totalChargesContent
    cross.textContent = 'X';
    cross.classList.add('close')

    li.appendChild(checkin)
    li.appendChild(checkout)
    li.appendChild(rooms)
    li.appendChild(adult)
    li.appendChild(children)
    li.appendChild(roomName)
    li.appendChild(roomPrice)
    li.appendChild(totalCharges)
    // li.appendChild(cross)

    reservation.appendChild(li)

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('Reservation').doc(id).delete();
    })

}

// function renderCustomerRoom(doc){
//     let li = document.createElement('li');
//     let CustomerRooms = document.createElement('div');
//     let price = document.createElement('div');
//     let cross = document.createElement('div');
//     li.setAttribute('data-id', doc.id);
//     CustomerRooms.textContent = `Your Room: ${doc.CustomerRooms}`;
//     price.textContent = `Rooms Price: ${doc.price}`;
//     cross.textContent = 'X';
//     cross.classList.add('close')

//     li.appendChild(CustomerRooms);
//     li.appendChild(price);
//     // li.appendChild(cross);

//     reservation.appendChild(li)

//     //deleting data
//     cross.addEventListener('click', (e) => {
//         e.stopPropagation();
//         let id = e.target.parentElement.getAttribute('data-id');
//         db.collection('Reservation').doc(id).delete();
//     })
// }


auth.onAuthStateChanged(user => {
    if(user){
         //       realtime listener
        var cached = JSON.parse(window.sessionStorage.getItem('hotelreservation-cached'));
        
        renderReservation(cached)

        //  db.collection('Reservation').where("userId", "==", user.uid).where("uniqueResDocs", "==", "show").onSnapshot(snapshot => {
        //     let changes = snapshot.docChanges();
        //     changes.forEach(change => {
        //         if(change.type == 'added'){
        //             renderReservation(change.doc)
                
        //         }else if(change.type == 'removed'){
        //             let li = reservation.querySelector('[data-id=' + change.doc.id + ']')
        //             reservation.removeChild(li);
        //         }
        //     })
        // })
        // db.collection('Reservation').where("userId", "==", user.uid).where("customerRoomDB", "==", "customerRoomDB").onSnapshot(snapshot => {
        //     let changes = snapshot.docChanges();
        //     changes.forEach(change => {
        //         if(change.type == 'added'){
        //             renderCustomerRoom(change.doc)
                
        //         }else if(change.type == 'removed'){
        //             let li = reservation.querySelector('[data-id=' + change.doc.id + ']')
        //             reservation.removeChild(li);
        //         }
        //     })
        // })



        confirmForm.addEventListener('submit', (e) => {

            e.preventDefault();
            cached.email = user.email
            cached.firstname = confirmForm.firstname.value
            cached.lastname = confirmForm.lastname.value
            cached.contact = confirmForm.contact.value
            cached.userId = user.uid
            // console.log(user.email)
            db.collection('Reservation').add(
               cached
            ).then(() => {
                $('#success').modal('show')
                window.sessionStorage.setItem('hotelreservation-cached', '')
            })
            confirmForm.firstname.value = ""
            confirmForm.lastname.value = ""
            confirmForm.contact.value = ""
            
        })

        setupUi(user)
    }
    else{
        setupUi()
    }
})
