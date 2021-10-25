//listen for all auth status changes
const reservation = document.querySelector('#reservation-list');
const form = document.querySelector('#add-reservation-form');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const roomList = document.querySelector('#rooms-list');
var notAvailable = [];

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
    let cross = document.createElement('div');

    li.setAttribute('data-id', doc.id);
    checkin.textContent = `Checkin: ${doc.checkin}`;
    checkout.textContent = `Checkout: ${doc.checkout}`;
    rooms.textContent = `Rooms: ${doc.rooms}`;
    adult.textContent = `Adult: ${doc.adults}`;
    children.textContent = `Children: ${doc.children}`;
    cross.textContent = 'X';
    cross.classList.add('close')

    li.appendChild(checkin)
    li.appendChild(checkout)
    li.appendChild(rooms)
    li.appendChild(adult)
    li.appendChild(children)
   // li.appendChild(cross)

    reservation.appendChild(li)

    //deleting data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('Reservation').doc(id).delete();
    })

}
function ReservationResult(doc){
    let cached = JSON.parse(window.sessionStorage.getItem('hotelreservation-cached'));
    // console.log(doc)
    const data = doc.map(i => i.doc.data())
    // console.log(data)
    const rooms = data.filter((room) => {
        const checkout = new Date(room.checkout).getTime() 
        const checkin2 = new Date(cached.checkin).getTime()
        return checkin2 < checkout
        
    })
    // var availableRooms = filtered.map(room => room.id)
    notAvailable = rooms

}

db.collection('Reservation').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    ReservationResult(changes)
    
})
auth.onAuthStateChanged(user => {
    if(user){
         //       realtime listener
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

        //room realtime listener
        db.collection('rooms').onSnapshot(snapshot => {
       

            let changes = snapshot.docChanges();
            changes.forEach(change => {
                const doc = change.doc
               
                // console.log(notAvailable)
                // console.log(doc.id)
                if(change.type == 'added'  &&
                !notAvailable.filter(i => i.roomId == doc.id).length){
                    renderRooms(doc);

                }
            })
        })
        let hotelreservationcached = window.sessionStorage.getItem('hotelreservation-cached')
        if(!hotelreservationcached){
            return
        }
        renderReservation(JSON.parse(hotelreservationcached))
      //rooms list
function renderRooms(doc){
   
    let li = document.createElement('li');
    li.classList.add('rooms')
    let rooms = document.createElement('span');
    let roomSize = document.createElement('span');
    let price = document.createElement('span');
    let cross = document.createElement('div');

    var roomContent = `
        <img src="./img/inventory-img.jpg" alt="">
        <p class="room-size">${doc.data().roomDescription} - ${doc.data().roomSize}</p>
        <div class="price">
        <p>Price: <span class="room-price">${doc.data().price}</span></p>
        <button class="roomsBtn"> BOOK NOW </button>
        </div>
    `

    li.setAttribute('data-id', doc.id);
    // rooms.textContent = `Description: ${doc.data().roomDescription}`;
    // roomSize.textContent = `Room Size: ${doc.data().roomSize}`
    // price.textContent = `Price: ${doc.data().price}`;
    // cross.classList.add('fas');
    // cross.classList.add('fa-times');
    li.innerHTML = roomContent;
    roomList.appendChild(li);

    //delete data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
      
        db.collection('rooms').doc(id).delete();
    });
  
  
    const roomBtn = li.querySelector('.roomsBtn')
    roomBtn.addEventListener('click', (e) => {
     
        let rooms = e.target.parentElement.parentElement.querySelector('.room-size').innerHTML
        let roomPrice = e.target.parentElement.parentElement.querySelector('.room-price').innerHTML

        // db.collection('Reservation').add({
        //     price: roomPrice,
        //     CustomerRooms: rooms,
        //     userId: user.uid,
        //     customerRoomDB: "customerRoomDB"
        // }).then(() => {
        //    window.location.href = "/confirmbooking.html";
        // })
        let cached = JSON.parse(window.sessionStorage.getItem('hotelreservation-cached'));
        // console.log(roomPrice)

        cached.roomId = doc.id
        cached.CustomeRooms = rooms;
        cached.price = roomPrice;
        cached.totalPrice = parseInt(cached.price.substring(1), 10) * cached.dayRates
        window.sessionStorage.setItem('hotelreservation-cached', JSON.stringify(cached))
    
        window.location.href = "confirmbooking.html"

   
    })
}   
        setupUi(user)

    }
    else{
        setupUi()
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
  