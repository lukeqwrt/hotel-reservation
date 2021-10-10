const reservation = document.querySelector('#reservation-list');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const confirmForm = document.querySelector('#confirmForm')

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
const table = document.getElementById('table')
function renderReservation(doc){

    let tr = document.createElement('tr');
    tr.classList.add('mytr')
    const buttons = document.getElementById('buttons')
    // let email = document.createElement('div');
    // let firstname = document.createElement('div');
    // let lastname = document.createElement('div');
    // let contact = document.createElement('div');
    // let reservefrom = document.createElement('div');
    // let reserveto = document.createElement('div');
    // let adults = document.createElement('div');
    // let children = document.createElement('div');
    // let rooms = document.createElement('div');
    // let customerRooms = document.createElement('div');
    // let userid = document.createElement('div');
    // let cross = document.createElement('button');
    // cross.classList.add('btn')
    // cross.textContent = 'X';
    var tdContent = `
        <td class="text-nowrap">
            ${doc.data().email}
        </td>
        <td class="text-nowrap">
            ${doc.data().firstname}
        </td>
        <td class="text-nowrap">
            ${doc.data().lastname}
        </td>
        <td class="text-nowrap">
            ${doc.data().contact}
        </td>
        <td class="text-nowrap">
            ${doc.data().checkin}
        </td>
        <td class="text-nowrap text-trucate" >
            ${doc.data().checkout}
        </td>
        <td class="text-nowrap">
            ${doc.data().adults}
        </td>
        <td class="text-nowrap">
            ${doc.data().children}
        </td>
        <td class="text-nowrap">
            ${doc.data().rooms}
        </td>

        <td class="text-nowrap">
            ${doc.data().CustomeRooms}
        </td>
        <td class="text-nowrap">
          ${doc.data().userId}
        </td>
        <td id="buttons" class="d-flex text-nowrap" style="position: sticky;
        right:0;
        background-color: white;
        z-index:2;">
            <button class="btn btn-warning text-white mr-2">Accept</button>
            <button class="btn btn-danger mr-2">Cancel</button>
            <button id="remove" class="btn btn-default mr-2">X</button>
        </td>
    `

    tr.setAttribute('data-id', doc.id);
    // email.textContent = `Email: ${doc.data().email}`;
    // firstname.textContent = `Firstname: ${doc.data().firstname}`;
    // lastname.textContent = `Lastname: ${doc.data().lastname}`;
    // contact.textContent = `Contact: ${doc.data().contact}`;
    // reservefrom.textContent = `reservefrom: ${doc.data().checkin}`;
    // reserveto.textContent = `reserveto: ${doc.data().checkout}`;
    // adults.textContent = `adults: ${doc.data().adults}`;
    // children.textContent = `children: ${doc.data().children}`;
    // rooms.textContent = `rooms: ${doc.data().rooms}`;
    // customerRooms.textContent = `customerRooms: ${doc.data().CustomeRooms}`;
    // userid.textContent = `userid: ${doc.data().userId}`;
    // cross.textContent = 'X';
    // cross.classList.add('cross')


    // li.appendChild(email)
    // li.appendChild(firstname)
    // li.appendChild(lastname)
    // li.appendChild(contact)
    // li.appendChild(reservefrom)
    // li.appendChild(reserveto)
    // li.appendChild(adults)
    // li.appendChild(children)
    // li.appendChild(rooms)
    // li.appendChild(customerRooms)
    // li.appendChild(userid)
    // li.appendChild(cross)

    tr.innerHTML = tdContent;
    // console.log(tr.querySelector('#remove'))
    const removeBtn = tr.querySelector('#remove')
    // buttons.appendChild("x")
    table.appendChild(tr)

    // deleting data
    removeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.parentElement.getAttribute('data-id');
        db.collection('Reservation').doc(id).delete();
    })

}


auth.onAuthStateChanged(user => {
    if(user){
         //       realtime listener
         db.collection('Reservation').onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if(change.type == 'added'){
                    renderReservation(change.doc)
                
                }else if(change.type == 'removed'){
                    let li = table.querySelector('[data-id=' + change.doc.id + ']')
            
                    table.removeChild(li);
                }
            })
        })
        
        setupUi(user)
    }
    else{
        setupUi()
        
    }
})
