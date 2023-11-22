const SOLUTIONS = {
    'trivial':[
        [0,0,0,1,1],
        [0,0,1,1,0],
        [0,1,1,0,0],
        [1,1,0,0,0],
        [1,1,1,1,1]
    ],
    'easy':[
        [0,0,0,1,0,1,0,0,0,0],
        [1,1,0,1,0,1,0,1,1,0],
        [0,1,1,1,1,1,1,1,0,0],
        [0,0,1,0,1,1,1,0,0,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,1,1,1,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,1,1],
        [0,0,1,1,1,1,1,1,1,1],
        [0,0,1,1,1,1,1,1,1,1],
        [0,0,1,1,1,1,0,0,0,0]
    ],
    'intermediate':[
        [0,0,1,0,0,0,0,1,0,0],
        [0,1,1,1,0,0,1,1,1,0],
        [1,1,1,1,1,1,1,1,1,1],
        [1,1,0,0,1,0,0,1,1,1],
        [1,1,0,0,0,0,0,1,1,1],
        [1,1,0,0,0,0,1,1,1,1],
        [0,1,1,0,0,1,1,1,1,0],
        [0,0,1,1,1,1,1,1,0,0],
        [0,0,0,1,1,1,1,0,0,0],
        [0,0,0,0,1,1,0,0,0,0]

    ],
    'hard':[
        [0,0,0,0,0,0,1,1,1,1,1,0,0,0,0],
        [0,0,0,0,0,1,1,1,0,0,1,1,0,0,0],
        [0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,0,0,0,1,0],
        [0,0,1,0,0,1,1,0,0,0,0,0,0,1,1],
        [0,0,1,1,0,0,1,0,1,0,0,1,0,0,1],
        [0,1,0,0,1,0,1,1,1,1,0,1,1,0,1],
        [0,0,1,1,1,1,1,1,1,0,0,1,1,1,1],
        [0,1,0,0,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,1,1,1,1,1,1,0,0,1,1,1,1,0],
        [0,0,0,1,1,1,1,1,1,0,0,1,1,0,0],
        [1,1,1,1,1,1,0,1,0,1,0,0,0,0,0],
        [1,1,1,1,0,1,0,1,0,1,1,0,0,0,0],
        [0,1,1,1,0,0,1,0,1,0,0,0,0,0,0],
        [0,0,1,1,0,0,0,0,0,0,0,0,0,0,0]
    ]
}

function generate_left_numbers(level) {    /*this code is partially created by genAI, and modified by me to make it work correctly*/
    let matrix = copy_matrix(SOLUTIONS[level])
    const left_numbers = [];
    for (let row of matrix) {
        let square = [];
        let count = 0;

        for (let cell of row) {
            if (cell === 1) {
                count++;
            } else if (count > 0) {
                square.push(count);
                count = 0;
            }
        }

        if (count > 0) {
            square.push(count);
        }

        left_numbers.push(square.length === 0 ? [0] : square);
    }

    return left_numbers;
}

function generate_top_numbers(level) {      /*this code is partially created by genAI, and modified by me to make it work correctly*/
    let matrix = copy_matrix(SOLUTIONS[level])
    const top_numbers = [];
    const row_count = matrix.length;
    const col_count = matrix[0].length;

    for (let col = 0; col < col_count; col++) {
        let square = [];
        let count = 0;

        for (let row = 0; row < row_count; row++) {
            if (matrix[row][col] === 1) {
                count++;
            } else if (count > 0) {
                square.push(count);
                count = 0;
            }
        }

        if (count > 0) {
            square.push(count);
        }

        top_numbers.push(square.length === 0 ? [0] : square);
    }

    return top_numbers;
}

let top_numbers_list;
let left_numbers_list;
let playboard;
let current_level;

let LIVES = 3;
let lives = LIVES;
let moves1 = 0;
let moves2 = 0;

let timer_interval1;
let timer_interval2;
let game_is_won = false;

let player = 1

window.onload = function(){
    change_level(document.getElementById('select_level').value);
}

function change_level(level){
    top_numbers_list = generate_top_numbers(level);
    left_numbers_list = generate_left_numbers(level);
    current_level = level
    playboard = copy_matrix(SOLUTIONS[level]);
    playboard = empty_matrix(playboard);
    restart_game()
}

function copy_matrix(matrix) {
    return matrix.map(row => Array.isArray(row) ? copy_matrix(row) : row);
}

function empty_matrix(matrix){
    for(let i=0; i<matrix.length; i++){
        for(let j=0; j<matrix[i].length;j++){
            matrix[i][j]=0;
        }
    }
    return matrix
}

function restart_game(){
    player = 2
    change_player()
    game_is_won = false
    playboard = empty_matrix(playboard);
    pause_timer1()
    reset_timer1()
    reset_timer2()
    lives = LIVES
    update_lives()
    moves1 = 0
    moves2 = 0
    update_moves1()
    update_moves2()
    playboard = empty_matrix(playboard);
    draw_board(playboard,current_level);
}

function draw_board(board,level){ 
    board_html = generate_board_html(board, level)
    document.getElementById("board_container").innerHTML = board_html
}

function generate_board_html(board,level){
    let table_inner_html = '<tr>'
    table_inner_html += generate_first_row_html()
    table_inner_html += '</tr>'
    for (let i=0 ; i < board.length; i++){
        table_inner_html += generate_row_html(board, i);
    }

    return table_inner_html
}

function generate_row_html(board, value){
    let html = '<tr>'
    html += generate_left_number_html(value);
    for (let i=0; i<board[value].length; i++){
        html += generate_square(board[value][i])
    }
    html += '</tr>'
    return html
}

function generate_square(type){
    let square_class = 'empty';
    let square_content = '';
    if (type == 1){
        square_class = 'filled';
    }
    if (type == -1){
        square_class = 'marked_empty';
        square_content = 'X';
    }
    return `<td class="${square_class} board_element" onclick="left_click_handler(this)" oncontextmenu="right_click_handler(event, this)">${square_content}</td>`
}

function generate_left_number_html(value){
    let html = '<td class="left_numbers">'
    for (let i = 0; i<left_numbers_list[value].length; i++){
        html += `<span>${left_numbers_list[value][i]}</span>`
    }
    html += '</td>'
    return html
}

function generate_first_row_html(){
    let html = '<td></td>'
    for (let i = 0; i < top_numbers_list.length; i++){
        let column_html = '<td class="top_numbers">'
        for (let j = 0; j < top_numbers_list[i].length ; j++){
            column_html += `<div>${top_numbers_list[i][j]}</div>`
        }
        column_html += '</td>'
        html += column_html
    }
    return html
}

function left_click_handler(element){
    if (!game_is_won){
        let col = element.cellIndex -1;
        let row = element.parentNode.rowIndex -1;
        if(playboard[row][col] == 0){
            update_board(playboard,current_level,col,row,1)
        }
    }
}
function right_click_handler(event, element){
    if (!game_is_won){
        event.preventDefault();
        let col = element.cellIndex -1;
        let row = element.parentNode.rowIndex -1;
        if(playboard[row][col] == 0){
            update_board(playboard,current_level,col,row,-1)
        }
    }
}

function update_board(board,level,col,row,value){
    if (player===1){
        new_move1()
        pause_timer1()
        start_timer2()
    }
    else {
        new_move2()
        pause_timer2()
        start_timer1()
    }
    if (check_if_square_input_is_correct(level,col,row,value)){
        board[row][col]=value;
        draw_board(board,level);
    }
    else{
        let right_answer= SOLUTIONS[level][row][col];
        if (right_answer==0){right_answer=-1};
        board[row][col]=right_answer;
        draw_board(board,level);
        if (player == 1){
            time_added1();
        }
        else{
            time_added2()
        }
        /* life_lost(); */
    }
    check_for_completed_line(board,level,col,row)
    check_win(board,level);
    
}

function check_if_square_input_is_correct(level,col,row,value){
    if (value==-1){
        value=0;
    }

    if (SOLUTIONS[level][row][col]==value){
        return true
    }
    return false
}

function check_win(my_board,level){
    let solution = SOLUTIONS[level];
    let won = true;
    for(let i = 0; i < solution.length; i++){
        for(let j=0; j< solution[i].length;j++){
            if  (solution[i][j] == 1 && solution[i][j] != my_board[i][j]){
                won = false
            }
        }
    }
    if (won==true){
        game_is_won=true
        winning_message();
    }
    else {
        change_player()
    }
}

function winning_message(){
    pause_timer1()
    pause_timer2()
    const minutes = Math.floor(seconds1 / 60);
    const seconds_remaining = seconds1%60;
    let message = `congratulations, you won! 
you completed the puzzle in ${moves} moves,
and it took you ${minutes} minutes and ${seconds_remaining} seconds`
    alert(message)
}

function life_lost(){
    lives += -1
    update_lives()
    if (lives <= 0){
        alert('you lost :c   try again')
        restart_game();
    }
    else{
        alert('FOUT');
    }
}

//MOVES FUNCTIONS:
function new_move1(){
    moves1 += 1
    update_moves1()
}
function new_move2(){
    moves2 += 1
    update_moves2()
}
function update_moves1(){
    document.getElementById("move_count1").innerHTML = `${moves1} moves`
}
function update_moves2(){
    document.getElementById("move_count2").innerHTML = `${moves2} moves`
}

//LIVES FUNCTIONS:
function update_lives(){
    document.getElementById("lives_count").innerHTML = `${lives} lives`
}


// TIMER FUNCTIONS: 
function time_added1(){
    seconds1 += 15;
    alert('FOUT, 15 seconds have been added to the timer');
    update_timer_display1();

}

function time_added2(){
    seconds2 += 15;
    alert('FOUT, 15 seconds have been added to the timer');
    update_timer_display2();
}

function start_timer1(){
    timer_is_running1 = true
    timer_interval1=setInterval(update_timer1,1000)
}

function start_timer2(){
    timer_is_running2 = true
    timer_interval2=setInterval(update_timer2,1000)
}

function update_timer1(){
    seconds1++;
    update_timer_display1();
}

function update_timer2(){
    seconds2++;
    update_timer_display2();
}

function update_timer_display1(){
    const minutes = Math.floor(seconds1 / 60);
    const seconds_remaining = seconds1%60;
    document.getElementById("timer1").innerHTML = `${minutes < 10? '0':''}${minutes}:${seconds_remaining < 10 ? '0' : '' }${seconds_remaining}`
}

function update_timer_display2(){
    const minutes = Math.floor(seconds2 / 60);
    const seconds_remaining = seconds2%60;
    document.getElementById("timer2").innerHTML = `${minutes < 10? '0':''}${minutes}:${seconds_remaining < 10 ? '0' : '' }${seconds_remaining}`
}

function pause_timer1(){
    clearInterval(timer_interval1);
    timer_is_running1 = false
}

function pause_timer2(){
    clearInterval(timer_interval2);
    timer_is_running2 = false
}

function reset_timer1(){
    pause_timer1();
    seconds1=0;
    update_timer_display1();
}

function reset_timer2(){
    pause_timer2();
    seconds2=0;
    update_timer_display2();
}


function change_player(){
    if (player === 1){
        player = 2
        player_in_letters = 'two'
    }
    else{
        player = 1
        player_in_letters = 'one'
    }
   
    document.getElementById("player").innerHTML = `player ${player_in_letters}'s turn: `
}












/*



DIT IS NIEUWE CODE



*/
function check_for_completed_line(board,level,col,row){
    check_row(board, level, row)
    check_column(board,level,col)
    if (check_row(board, level, row) || check_column(board,level,col)){
        draw_board(board, level)
    }
}
function check_column(board,level,col){
    let testlist1 = []
    let testlist2 = []
    for (let i=0; i<board.length ; i++){
        testlist1[i] = board[i][col]
        testlist2[i] = SOLUTIONS[level][i][col]
    }
    if (compare_list(testlist1,testlist2)){
        for (let i=0; i<board.length ; i++){
            if (board[i][col] == 0){
                board[i][col] = -1
            }
        }
        return true
    }
    return false
}

function check_row(board, level, row){
    if (compare_list(board[row],SOLUTIONS[level][row])){
        for (let i=0;i<board[row].length;i++){
            if (board[row][i] == 0){
                board[row][i] = -1
            }  
        }
        return true
    }
    return false
}

function compare_list(list1,list2){
    if (list1.length !== list2.length){
        return false
    }
    for (let i=0;i<list1.length;i++){
        if (list1[i] === 1 ^ list2[i] === 1){
            return false
        }
    }
    return true
}
 /*



 Einde nieuwe code 




 */