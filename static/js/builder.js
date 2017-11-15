let all_params;

/* Get player parameters from form */
function getPlayerParams() {
  let params = [[],[]]
  let max = parseInt(document.getElementById('player_num').value);
  for (let i = 0; i < max; i++) {
    params[0].push(i);
  }
  params[1].push(true);
  params[1].push(document.getElementById('player_faceup').checked);
  params[1].push(document.getElementById('player_stack').checked);
  params[1].push(document.getElementById('player_vert').checked);
  params[1].push(document.getElementById('player_secret').checked);
  params[1].push(document.getElementById('player_max').value);
  return params;
}
/* Get pile parameters from form */
function getPileParams(row,col) {
  let params = []
  params.push(true);
  params.push(document.getElementById('pile_' + row + '_' + col + '_faceup').checked);
  params.push(document.getElementById('pile_' + row + '_' + col + '_stack').checked);
  params.push(document.getElementById('pile_' + row + '_' + col + '_vert').checked);
  params.push(false);
  params.push(parseInt(document.getElementById('pile_' + row + '_' + col + '_max').value));
  return params;
}
/* Create an array of pile parameters */
function getPilesParams() {
  let params = [];
  let row;
  let param;
  for (let i = 0; i < 4; i++) {
    row = [];
    for (let j = 0; j < 13; j++) {
      param = [];
      if (document.getElementById('pile_' + i + '_' + j)) {
        param = getPileParams(i, j);
      }
      row.push(param);
    }
    params.push(row);
  }
  return params;
}
/* Create pile parameter form when 'add new' button is clicked */
document.getElementById('new_add').addEventListener('click', function(e) {
  e.preventDefault();
  let i = document.getElementById('new_row').value;
  let j = document.getElementById('new_col').value;
  let elem = `
    <div id="pile_${i}_${j}" class="game-card">
      <h3>Pile ${i}, ${j}</h3>
      <label for="pile_${i}_${j}_max">Max Cards in Pile:</label>
      <select id="pile_${i}_${j}_max">
        <option value="0">0</option>              
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>              
        <option value="11">11</option>
        <option value="12">12</option>
        <option value="13">13</option>
        <option value="14">14</option>
        <option value="15">15</option>
        <option value="16">16</option>
        <option value="17">17</option>
        <option value="18">18</option>
        <option value="19">19</option>
        <option value="20">20</option>              
        <option value="21">21</option>
        <option value="22">22</option>
        <option value="23">23</option>
        <option value="24">24</option>
        <option value="25">25</option>
        <option value="26">26</option>
        <option value="27">27</option>
        <option value="28">28</option>
        <option value="29">29</option>
        <option value="30">30</option>              
        <option value="31">31</option>
        <option value="32">32</option>
        <option value="33">33</option>
        <option value="34">34</option>
        <option value="35">35</option>
        <option value="36">36</option>
        <option value="37">37</option>
        <option value="38">38</option>
        <option value="39">39</option>
        <option value="40">40</option>              
        <option value="41">41</option>
        <option value="42">42</option>
        <option value="43">43</option>
        <option value="44">44</option>
        <option value="45">45</option>
        <option value="46">46</option>
        <option value="47">47</option>
        <option value="48">48</option>
        <option value="49">49</option>
        <option value="50">50</option>              
        <option value="51">51</option>
        <option value="52">52</option>
      </select>
      <label for="pile_${i}_${j}_faceup">Faceup:</label>
      <input id="pile_${i}_${j}_faceup" type="checkbox"/>
      <label for="pile_${i}_${j}_stack">Stack:</label>
      <input id="pile_${i}_${j}_stack" type="checkbox"/>
      <label for="pile_${i}_${j}_vert">Horizontal or Vertical:</label>
      <input id="pile_${i}_${j}_vert" type="checkbox"/>
      <button id="pile_${i}_${j}_remove">Remove this pile</button>
    </div>`;
  /* If it has not already been created */
  if (!document.getElementById('pile_' + i + '_' + j)) {
    /* Insert it */
    this.parentNode.insertAdjacentHTML('afterend',elem);
    /* Add event listener to remove button */
    document.getElementById('pile_' + i + '_' + j + '_remove').addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.remove();
    });
  }
});
/* Add event listener to all change events on the body */
document.body.addEventListener('change', function (event) {
  /* Update copyable parameter string */
  updateParams();
});
/* Get parameters from all forms, and write it to the html */
function updateParams() {
  let params = [];
  params.push(getPlayerParams());
  params.push(getPilesParams());
  document.getElementById('new_parameters').value = JSON.stringify(params);
  all_params = params;
}
document.getElementById('play_new_game').addEventListener('click', function(e) {
  e.preventDefault();
  window.location.assign('/create/' + JSON.stringify(all_params));
});
