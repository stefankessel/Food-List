// Item CTrl
const ItemCtrl = (function(){
    //Constructor
    const Item = function(id, name, cal){
        this.id = id;
        this.name = name;
        this.cal = cal;
    }
    // Data Structure, State
    const data = {
        items: [ 
                // {id: 0, name: 'Steak', cal: 1000},
                // {id: 1, name: 'Bread', cal: 900},
                // {id: 2, name: 'Apple', cal: 100}
                ],
        currentItem: null,
        totalCal: 0
    }

    // public 
    return {
        getItems: function(){
            return data.items;
        },
        getItemId: function(id){
            let found;
            data.items.forEach(function(item){
                if(item.id === id){
                    found = item;
                }
            });
            return found;
        },
        getCurrentItem: function(){
            return data.currentItem;
        },
        setCurrentItem: function(item){
            data.currentItem = item;
        },
        addItem: function(name, cal){
            // add ID
            let ID;
            if(data.items.length > 0){
                // taking the last array object, crab the id and add 1 to it
                ID = data.items[data.items.length - 1].id +1;
            }else{
                ID = 0;
            }
            // parse cal; string to number
            cal = parseInt(cal);
            // call constructor
            newItem = new Item(ID, name, cal);
            // push new Item to Array of Items
            data.items.push(newItem);

            return newItem;
        },
        editItem: function(name, cal){
            // parse cal as number
            cal = parseInt(cal);
            let found;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id){
                    item.name = name;
                    item.cal = cal;
                    found = item;
                }
            });
            return found;
        },
        deleteItem: (id) => {
          // create an Array of all ids
          const idArr = data.items.map( item => {              
                return item.id;
          });

          // get index
          index = idArr.indexOf(id);

          // delete id 
          data.items.splice(index, 1);

        },
        deleteAllItems: () => {
            data.items = [];
        },
        totalCals: function(){
            let total = 0;
            // loop through all objects/ items and fetch cal
            data.items.forEach(function(item){
                total += item.cal;
            });
            data.totalCal = total;
            return data.totalCal;
        },
        logData: function(){
            return data;
        }
    }
})();

// UI Ctrl
const UICtrl = (function(){
    // private
    const UISelectors = {
        itemList: '#item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.remove-btn',
        deleteAllBtn: '.btn-clear',
        backBtn: '.back-btn',
        inputName: '#item-name',
        inputCal: '#item-cal',
        totalCals: '.total-calories'
    }

    // public
    return {
        initialState: function(){
            this.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showUpdateState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        showResults: function(items){
            let output = '';

            items.forEach(function(item){
                output += `
                <li class="collection-item" id="${item.id}">
                    <strong>${item.name}: </strong> <em>${item.cal} Calories</em>
                    <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
                `;
            });
            document.querySelector(UISelectors.itemList).innerHTML = output;
        },
        addListItem: function(item){
            //create new Element
            let li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`;
            li.innerHTML = `<strong>${item.name}: </strong> <em>${item.cal} Calories</em>
                            <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                            `;
            document.querySelector(UISelectors.itemList).appendChild(li);
        },
        editListItem: item => {
            document.querySelector(`#item-${item.id} > strong`).textContent = `${item.name}: `;
            document.querySelector(`#item-${item.id} > em`).textContent = `${item.cal} Calories`;
        },
        deleteListItem: id => {
            const itemId = `#item-${id}`;
            document.querySelector(itemId).remove();
        },
        deleteAllListItems: () => {
            let lists = document.querySelectorAll(UISelectors.listItems);
            // change Node List to an Array
            lists = Array.from(lists);
            // loop
            lists.forEach(function(list){
                list.remove();
            });
        },
        addTotalCal: function(cals){
            document.querySelector(UISelectors.totalCals).textContent = cals;
        },
        getSelectors: function(){
            return UISelectors;
        },
        getInput: function(){
            return{
            name: document.querySelector(UISelectors.inputName).value,
            cal: document.querySelector(UISelectors.inputCal).value
            }
        },
        clearInput: function(){
            document.querySelector(UISelectors.inputName).value = '';
            document.querySelector(UISelectors.inputCal).value = '';
        },
        showCurrentItem: function(){
            document.querySelector(UISelectors.inputName).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.inputCal).value = ItemCtrl.getCurrentItem().cal;
            this.showUpdateState();
        }
    }

})();

// App Ctrl
const App = (function(ItemCtrl, UICtrl){
    // load events method
    const loadEvents = function(){
        const UISelectors = UICtrl.getSelectors();
        // listen for add Btn
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
        // listen to update icon
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateClick);
        // listen to update Btn
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);
        // listen to delete Btn
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', deleteItemSubmit);
        // listen to delete All Btn
        document.querySelector(UISelectors.deleteAllBtn).addEventListener('click', deleteAllClick);
        // listen to back Btn
        document.querySelector(UISelectors.backBtn).addEventListener('click', () => {
            UICtrl.initialState();
        });
        // disable enter
        document.addEventListener('keypress', (e) => {
            if(e.keyCode === 13 || e.which === 13){
                e.preventDefault();
                return false;
            }
        })
    }
    const itemAddSubmit = function(e){
        // get Input from UI
        const input = UICtrl.getInput();
        
        //check for input values
        if(input.name !== '' && input.cal !== ''){
            const newItem = ItemCtrl.addItem(input.name, input.cal);
            // add Items to ul
            UICtrl.addListItem(newItem);

            // add total cals
            const totalCals = ItemCtrl.totalCals();
            UICtrl.addTotalCal(totalCals);

            //clear Input fields in UI
            UICtrl.clearInput();
        }

        e.preventDefault();
    }
    const itemUpdateClick = function(e){
        // click only on icon 
        if(e.target.classList.contains('edit-item')){
            // get the list id
            const listId = e.target.parentNode.parentNode.id;
            const listIdArr = listId.split('-');
            const id = parseInt(listIdArr[1]);
            // get the item/ object of list id
            const itemToUpdate = ItemCtrl.getItemId(id);
            // set item to current item
            ItemCtrl.setCurrentItem(itemToUpdate);
            // display current item in UI/ input form
            UICtrl.showCurrentItem();
            
        }
    }
    const itemUpdateSubmit = function(){
        // get Input from UI
        const input = UICtrl.getInput();
        // check for valid values
        if(input.name !== '' && input.cal !== ''){
            // update in Item Ctrl
            const updateItem = ItemCtrl.editItem(input.name, input.cal);
            // update in UI
            UICtrl.editListItem(updateItem);

            // add total cals
            const totalCals = ItemCtrl.totalCals();
            UICtrl.addTotalCal(totalCals);
            
            //clear Input fields in UI
            UICtrl.clearInput();
        }
    }
    const deleteItemSubmit = (e) => {
        // get current Item
        const currentItem = ItemCtrl.getCurrentItem();
        // delete current Item from data structure
        ItemCtrl.deleteItem(currentItem.id);

        // delete from UI
        UICtrl.deleteListItem(currentItem.id);
        // add total cals
        const totalCals = ItemCtrl.totalCals();
        UICtrl.addTotalCal(totalCals);
            
        //clear Input fields in UI
        UICtrl.clearInput();

        e.preventDefault();
    }
    const deleteAllClick = () => {
        // delete from data structure
        ItemCtrl.deleteAllItems();
        // delete from UI
        UICtrl.deleteAllListItems();
       // show total cals
       const totalCals = ItemCtrl.totalCals();
       UICtrl.addTotalCal(totalCals);
    }
    
    // Public method
    return {
        init: function(){
            UICtrl.initialState();
            // bind list items
            const items = ItemCtrl.getItems();
            // display Items in UI
            UICtrl.showResults(items);
            // load Event Listeners
            loadEvents();
        }
    }

})(ItemCtrl, UICtrl);

App.init();
