const url = 'http://localhost:3000/current-exhibits';
//grab elements
const currExhibitTitle = document.querySelector('#exhibit-title');
const ticketsBought = document.querySelector('#tickets-bought');
const exhibitDescription = document.querySelector('#exhibit-description');
const exhibitComments = document.querySelector('#comments-section');
const exhibitImg = document.querySelector('#exhibit-image');
const newComment = document.querySelector('#comment-form');
const buyTicketBtn = document.querySelector('#buy-tickets-button');

//update exhibit function (does not update comments)
const updateExhibit = (currentExhibit) => {
    currExhibitTitle.textContent = currentExhibit['title'];
    ticketsBought.textContent  = `${currentExhibit['tickets_bought']} Ticket(s) Bought`;
    exhibitDescription.textContent  = currentExhibit['description'];
    exhibitImg.src = currentExhibit['image'];
}

//fetch request
const fetchExhibit = async () => {
    //request from db
    const req = await fetch(`${url}/1`);
    //get promise as json
    const res = await req.json();
    //return promise
    return res; 
};

//render page (not comments)
const renderPage = async () => {
    //get data struct from promise, run at call time
    const exhibit = await fetchExhibit();
    updateExhibit(exhibit);
};

//renders comment section
const renderComments = async() => {
    //clearing previous elements
    exhibitComments.innerHTML = '';
    //get data struct from promise, run at call time
    const exhibit = await fetchExhibit();
    //get the comments section array
    const comments = exhibit.comments;
    //iterate through array and add elements
    for(comment of comments){
        //create paragraph element to append
        let userComment = document.createElement('p');
        //set the comment
        userComment.textContent = comment;
        //append that mofo
        exhibitComments.append(userComment);
    }    
}

//new comment adder
newComment.addEventListener('submit', async (event) => {
    //stop refresh
    event.preventDefault();
    //get value from user input
    const newUserComment = newComment['comment-input'].value; 
    //check if blank string
    if(newUserComment != ''){
        //if valid, fetch obj from db
        const exhibit = await fetchExhibit();
        //make copy of comments array
        const newComments = exhibit.comments;
        //add the new array
        newComments.push(newUserComment);

        //update the array 
        let result = await fetch(`${url}/1`, {
            method: 'PATCH',
            body: JSON.stringify({
                comments: newComments,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
        //render the comment section
        renderComments();
        
    } else {
        //if invalid, alert user 
        alert('Invalid comment!');
    }

    //clear the input area
    return  document.querySelector("#comment-form > input[type=text]:nth-child(1)").value='';
})

buyTicketBtn.addEventListener('click', async (event) => {
    //get fetch
    let exhibit = await fetchExhibit();
    //get number of tickets currently and increment by 1
    let currTicketsBought = exhibit['tickets_bought'] + 1;
    //update the number of tickets bought in the db
    let updateTickets = await fetch(`${url}/1`, {
        method: 'PATCH',
        body: JSON.stringify({
            tickets_bought: currTicketsBought,
        }),
        headers: {
            "Content-Type": "application/json",
        },
    })
    //render the page with updated information
    renderPage();
})
renderPage();
renderComments();