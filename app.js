
/*WEB SQL 사용 */
var dbName = 'mydb';
var dbVersion = 3;
var dbDescription = 'to-do-list localstorage';
var dbSize = 256 * 256 * 2;
var db;
db = window.openDatabase(dbName, dbVersion, dbDescription, dbSize);
db.transaction(function( tx ){ //db설계항목 참고
        var sql = 
        'CREATE TABLE LIST (to_do_contents TEXT(255) NOT NULL, time TIMESTAMP NOT NULL PRIMARY KEY)';
        tx.executeSql(sql) ;
  });
  /* not use drop table
function dropTable(){//drop table, 
    db.transaction(function( tx ){ 
        var sql = 'DROP TABLE LIST';
        tx.executeSql( sql );
    });
}
*/
function insertContents(contents, timestamp){//insert contents into table
    db.transaction(function( tx ){ 
        var sql = 'INSERT INTO LIST (to_do_contents, time) VALUES (?, ?)';
        var args = [contents, timestamp];
        tx.executeSql( sql, args );
    });
}

function deleteContents(timestamp){
    db.transaction(function(tx){ // delete contents in table(LIST)
        tx.executeSql('DELETE FROM LIST WHERE time = ?', [timestamp]);
    }); 
}
/* DB 관련 끝 */


var arraynum = 0;
var addId = document.getElementById('add'); // 할일추가 버튼id
var listId = document.getElementById('list'); // ul의 id
var inputContextId = document.getElementById('context'); //내용 id
var btnnum = 0; // button 고유 id

var getSortId = document.getElementById('sort');
getSortId.onclick = () => {  //DOM element를 추출해 정렬해준다.
    var li = $('#con');
    var time = li.childNode.$('#timestamp').get();
}

function createNewTask(add) {
    var listItem = document.createElement('li');
    var listtext = document.createElement('label');
    var contentsTime = document.createElement('label');
    var deleteButton = document.createElement('button');
    /*각 element 생성*/
    listtext.innerText = inputContextId.value; // 쓴 내용을 넣어줌
    listtext.id = "con";    // 쓴 내용의 label id
    contentsTime.innerText = timestamp; // 생성시간을 ms로 보여줌
    listItem.id = "task"; //리스트 넘버
    contentsTime.id = "timestamp"; //시간의 label id
    deleteButton.innerText = "삭제"; 
    deleteButton.id = "delete"; // 삭제 버튼의 id
    deleteButton.onclick = () => { // 삭제 버튼 만들면서 클릭이벤트도 넣어줌
        del(listItem, contentsTime);
    }
    listItem.appendChild(listtext); //contents
    listItem.appendChild(contentsTime); //time
    listItem.appendChild(deleteButton); //button
    /*하나의 일련의 li만들기 task*/
    
    return listItem;
}

addId.onclick = () => { // 버튼 id로 익명 method
    if(inputContextId.value === ""){
        alert("입력해 주세요");
    }
    else{
        var time = new Date();
        timestamp = new Date().getTime();
        time.setTime(timestamp);
        dateString = time.toUTCString(); // 작성날짜(표시)
        var newTask = createNewTask(addId.value);
        newTask.contentsTime = dateString;
        insertContents(inputContextId.value, timestamp); //web db에 저장
        listId.appendChild(newTask);
        ++btnnum;
        ++arraynum;
        document.getElementById('context').value = null; // add button 누르면 초기화
    }
};


function del(list, contentstime) {
    var item = list; // 해당 리스트의 parent를 받아온다.
    var id = contentstime.innerText;
    item.remove(item); //삭제
    deleteContents(id); //timestamp에 따른 db상의 삭제
    --arraynum;
}


