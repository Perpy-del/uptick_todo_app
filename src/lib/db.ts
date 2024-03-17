export function createTodoCollection () {
    if (!indexedDB) {
      console.log("IndexedDB could not be found in this browser.");
      return;
    }
    
    const request = indexedDB.open("todoDatabase", 2);

    request.onerror = (event) => {
        console.log("Error: ", event);
        console.log("An error occurred with IndexedDB")
    };
    request.onupgradeneeded = () => {
      const db = request.result;

      if (!db.objectStoreNames.contains("todoList")) {
        db.createObjectStore('todoList', {
            keyPath: "id",
        })
      }
    };

    request.onsuccess = () => {
        console.log("Database opened successfully");
    }
}

// store.createIndex("todo_title", ["title"], { unique: false });
// store.createIndex("todo_description", ["description"], {
//   unique: false,
// });
// store.createIndex("todo_date", ["date"], {
//   unique: false,
// });
// store.createIndex("todo_completed", ["completed"], {
//   unique: false,
// });
// store.createIndex(
//   "completed_todos",
//   ["title", "description", "date", "completed"],
//   {
//     unique: false,
//   },
// );
  export const request = indexedDB.open("TodoDatabase", 3);


//   request.onupgradeneeded = function () {
//     //1
//     const db = request.result;
  
//     //2
//     const store = db.createObjectStore("cars", { keyPath: "id" });
  
//     //3
//     store.createIndex("cars_colour", ["colour"], { unique: false });
  
//     // 4
//     store.createIndex("colour_and_make", ["colour", "make"], {
//       unique: false,
//     }); 
//   };

//   request.onerror = function (event) {
//     console.error("An error occurred with IndexedDB");
//     console.error(event);
//   };

//   request.onsuccess = function () {
//     console.log("Database opened successfully");
  
//     const db = request.result;
  
//     // 1
//     const transaction = db.transaction("todoList", "readwrite");
  
//     //2
//     const store = transaction.objectStore("todoList");
//     const dateIndex = store.index("todo_date");
//     const completedIndex = store.index("todo_completed");
//     const pendingIndex = store.index("todo_pending");
  
//     //3
//     store.put({ id: 1, colour: "Red", make: "Toyota" });
//     store.put({ id: 2, colour: "Red", make: "Kia" });
//     store.put({ id: 3, colour: "Blue", make: "Honda" });
//     store.put({ id: 4, colour: "Silver", make: "Subaru" });
  
//     //4
//     const idQuery = store.get(4);
//     const colourQuery = colourIndex.getAll(["Red"]);
//     const colourMakeQuery = makeModelIndex.get(["Blue", "Honda"]);
  
//     // 5
//     idQuery.onsuccess = function () {
//       console.log('idQuery', idQuery.result);
//     };
//     colourQuery.onsuccess = function () {
//       console.log('colourQuery', colourQuery.result);
//     };
//     colourMakeQuery.onsuccess = function () {
//       console.log('colourMakeQuery', colourMakeQuery.result);
//     };
  
//     // 6
//     transaction.oncomplete = function () {
//       db.close();
//     };
//   };