import * as urls from "/JS/api.js"; 

const apiUrlAllListings = urls.apiUrlAllListings;

async function getAuctions() {
    try {
        const response = await fetch(apiUrlAllListings);
        let auctions = await response.json();

        
        auctions.sort((a, b) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
        });
    
        return auctions; 
    } catch (error) {
        return error;
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('search');
    
    if (query) {
        const auctions = await getAuctions(); 
        const filteredResults = await searchAuctions(auctions, query); 

        const searchMessage = document.getElementById('search-message');
        if (filteredResults.length > 0) {
            searchMessage.textContent = `Showing ${filteredResults.length} results for "${query}"`;
        } else {
            searchMessage.textContent = `No results found for "${query}"`;
        }

        displayResults(filteredResults);
    }
});


async function searchAuctions(auctions, query) {
    if (!query) {
        return auctions;
    }

   
    return auctions.filter(auction => {
        const titleMatch = auction.title.toLowerCase().includes(query.toLowerCase());
        const userMatch = auction.seller.name.toLowerCase().includes(query.toLowerCase());
        
        return titleMatch || userMatch;
        
    });
}


async function displayResults(results) {
    const container = document.getElementById('post-container'); 

    results.forEach(result => {
            const post = document.createElement('div');
            post.classList.add('post','mb-4');
    
            const media = document.createElement('div');
            media.classList.add('listing-media');
            const image = document.createElement('img');
            image.src = result.media[0]; 
            image.classList.add('listing-media');
            media.appendChild(image);
    
            const postHeader = document.createElement('div');
            postHeader.classList.add('post-header','p-4');
    
            const sellerInfo = document.createElement('div');
            sellerInfo.classList.add('seller-info','d-flex','align-items-center');
    
            const title = document.createElement('h1');
            title.classList.add('title');
            title.textContent = result.title;
            postHeader.appendChild(title);
    
            const seller = document.createElement('h2');
            seller.classList.add('seller');
            seller.textContent = `${result.seller.name}`;
            sellerInfo.appendChild(seller);
    
            const userAvatar = document.createElement('img');
            userAvatar.classList.add('user-avatar');
            userAvatar.src = result.seller.avatar;
            sellerInfo.appendChild(userAvatar); 
    
            postHeader.appendChild(sellerInfo);
    
            const postContent = document.createElement('div');
            postContent.classList.add('post-content','p-4');
    
            const highestBid = document.createElement('p');
            highestBid.classList.add('highestBid');
    
           
            let highestAmount = 0;
            result.bids.forEach(bid => {
                if (bid.amount > highestAmount) {
                    highestAmount = bid.amount;
                }
    
            });
            highestBid.textContent = `Highest bid: ${highestAmount} credits`;
    
            const endDate = document.createElement('p');
            endDate.classList.add('endDate');
            endDate.textContent = ` Bidding ends at: ${new Date(result.endsAt).toLocaleString()}`;
    
            if(new Date(result.endsAt) < new Date()) {
                endDate.textContent = 'Bidding has ended';
                endDate.style.backgroundColor = 'red';
            }
    
            postContent.appendChild(highestBid);
            postContent.appendChild(endDate);
    
    
    
            post.appendChild(media);
            post.appendChild(postHeader);
            post.appendChild(postContent);
    
            container.appendChild(post);
    
    
            
            post.addEventListener('click', () => {
                window.location.href = '/single-Listing/index.html' + '?id=' + result.id;
            });
    });
}




