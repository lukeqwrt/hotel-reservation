const roomsList = document.querySelector('#rooms-list');
const form = document.querySelector('#add-rooms-form');
const editForm = document.querySelector('#edit-form')
function renderRooms(doc){
   
    let li = document.createElement('li');
    let rooms = document.createElement('span');
    let roomSize = document.createElement('span');
    let price = document.createElement('span');
    let count = document.createElement('span');
    let cross = document.createElement('div');
    let div = document.createElement('div');
 
    var editBtn = `
        <button class="btn btn-warning" data-toggle="modal" data-target="#editRoom">Update</button>
    `
    li.setAttribute('data-id', doc.id);
    rooms.textContent = `Description: ${doc.data().roomDescription}`;
    roomSize.textContent = `Room Size: ${doc.data().roomSize}`;
    price.textContent = `Price: ${doc.data().price}`;
    cross.classList.add('fas');
    cross.classList.add('fa-times');
    div.innerHTML = editBtn
    li.appendChild(rooms);
    li.appendChild(roomSize);
    li.appendChild(price);
    li.appendChild(div);
    li.appendChild(cross);
    li.classList.add('list-group-item')
    roomsList.appendChild(li);
  

    //delete data
    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
      
        db.collection('rooms').doc(id).delete();
    })

    //update not sure
    div.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        let editid = e.target.parentElement.parentElement.getAttribute('data-id');

        $('#editRoom').modal('show')

        editForm.addEventListener('submit', (e) => {
            e.stopPropagation();
            console.log(editid)
            db.collection('rooms').doc(editid).update({
                roomDescription: editForm.roomDescription.value,
                roomSize: editForm.roomSize.value,
                price: editForm.price.value
            })
            $('#editRoom').modal('hide')
      
        })
    })

}

//getting data
// db.collection('rooms').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderRooms(doc)
//     })
// })

//saving data

// //realtime listener
// db.collection('rooms').onSnapshot(snapshot => {
//     let changes = snapshot.docChanges();
//     changes.forEach(change => {
//         if(change.type == 'added'){
//             renderRooms(change.doc);
//         }else if(change.type == 'removed'){
//             let li = roomsList.querySelector('[data-id=' + change.doc.id + ']')
//             roomsList.removeChild(li);
//         }
//     })
// });
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
//admin login
const setupUi = (user) => {
    if(user){
        //account info
        const html = `
            <div>Admin:  ${user.email}</div>
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

const signupError = document.querySelector(".error-signup")
//listen for all auth status changes
auth.onAuthStateChanged(user => {
    if(user){
        //add data
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            db.collection('rooms').add({
                roomDescription: form.roomDescription.value,
                roomSize: form.roomSize.value,
                price: form.price.value,
                adminUID: 'bLLt1Zt5veW6nqFXctUHDYsCzgG3'
            });
        
            form.roomDescription.value = "";
            form.price.value = "";
            form.roomSize.value = "";
        
        })
        
        //getting realdata when logged in
        db.collection('rooms').where("adminUID", "==", user.uid).onSnapshot(snapshot => {
            let changes = snapshot.docChanges();
            changes.forEach(change => {
                if(change.type == 'added'){
                    renderRooms(change.doc);
                }else if(change.type == 'removed'){
                    let li = roomsList.querySelector('[data-id=' + change.doc.id + ']')
                    roomsList.removeChild(li);
                }
            })
        });
        
        setupUi(user)

 
    }
    else{
        setupUi();
              // realtime listener
         
    }
})