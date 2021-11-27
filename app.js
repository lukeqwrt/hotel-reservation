const reservation = document.querySelector('#reservation-list');
const form = document.querySelector('#add-reservation-form');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');

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
    setupUi(user)
});

form.addEventListener('submit', (e) => {
    // console.log(e)
    e.preventDefault();
    auth.onAuthStateChanged(user => {
        if(user){
            const date1formInput = document.querySelector('#dateCheckIn').value
            const date2formInput = document.querySelector('#dateCheckOut').value
    
            let date1 = new Date(date1formInput)
            let date2 = new Date(date2formInput)
            let diff = date2.getTime() - date1.getTime();
            let msInDay = 1000 * 3600 * 24;
            const dayPrice = diff/msInDay
            window.sessionStorage.setItem( 'hotelreservation-cached', JSON.stringify({
                checkin: date1formInput,
                checkout: date2formInput,
                userId: user.uid,
                dayRates: dayPrice,
                uniqueResDocs: 'show'
            }));
            $('#loginmodal').modal('hide')

            var prevDate = new Date(date1formInput)            
            var nextDate = new Date(date2formInput)        
            const message = document.querySelector('#message')
     
            if(prevDate >= nextDate){
                message.style.display = "block"
            }
            else{
                date1formInput.value = '';
                date1formInput.value = '';
                window.location.href = "/rooms.html"
            }

          
                    
                    
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
       
        }
        else{
            $('#loginmodal').modal('show');
        }
    });
})

function goToSecton(section){
    let el = document.getElementById(section);
    let elTop = el.offsetTop - 48;
    window.scroll({
        top: elTop,
        behavior: "smooth"
    })
  }
  
// show more
function toggleText() {
  
    // Get all the elements from the page
    var points = 
        document.getElementById("points");

    var showMoreText =
        document.getElementById("moreText");

    var buttonText =
        document.getElementById("textButton");

    // If the display property of the dots 
    // to be displayed is already set to 
    // 'none' (that is hidden) then this 
    // section of code triggers
    if (points.style.display === "none") {

        // Hide the text between the span
        // elements
        showMoreText.style.display = "none";

        // Show the dots after the text
        points.style.display = "inline";

        // Change the text on button to 
        // 'Show More'
        buttonText.innerHTML = "Show More";
    }

    // If the hidden portion is revealed,
    // we will change it back to be hidden
    else {

        // Show the text between the
        // span elements
        showMoreText.style.display = "inline";

        // Hide the dots after the text
        points.style.display = "none";

        // Change the text on button
        // to 'Show Less'
        buttonText.innerHTML = "Show Less";
    }
}
