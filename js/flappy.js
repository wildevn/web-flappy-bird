const available_tubes = []
const tubes_passed_ids = []
const bird = document.querySelector('.bird')
const score_e = document.querySelector('.score')
var score = 0
var ids = 0


function random_tubes_calc(top_tube_e, bottom_tube_e) {
    let rand = Math.floor(Math.random() * (400 - 100)) + 100

    top_tube_e.style.height = `${rand}px`
    // max height - rand number - 2 * border-tube height - 120 space between both
    bottom_tube_e.style.height = `${700 - rand - 160}px` 

    return [top_tube_e, bottom_tube_e]
}

function generates_tubes() {
    let new_div_tube_area = document.createElement('div')
    let new_div_top_column = document.createElement('div')
    let new_div_bottom_column = document.createElement('div')
    let new_div_top_tube = document.createElement('div')
    let new_div_bottom_tube = document.createElement('div')
    let new_div_base_top_tube = document.createElement('div')
    let new_div_base_bottom_tube = document.createElement('div')
    

    new_div_tube_area.setAttribute('id', `${ids}`)
    ids++
    
    
    new_div_tube_area.classList.add('tube-area')
    new_div_tube_area.style.left = '99%';
    new_div_top_column.classList.add('column')
    new_div_bottom_column.classList.add('column')
    new_div_top_tube.classList.add('top-tube')
    new_div_bottom_tube.classList.add('bottom-tube')
    new_div_base_top_tube.classList.add('base-tube')
    new_div_base_bottom_tube.classList.add('base-tube')
    
    new_div_top_column.appendChild(new_div_top_tube)
    new_div_top_column.appendChild(new_div_base_top_tube)
    new_div_bottom_column.appendChild(new_div_base_bottom_tube)
    new_div_bottom_column.appendChild(new_div_bottom_tube)
    
    new_div_tube_area.appendChild(new_div_top_column)
    new_div_tube_area.appendChild(new_div_bottom_column)
    
    
    [new_div_top_tube, new_div_bottom_tube] = random_tubes_calc(new_div_top_tube, new_div_bottom_tube)
    
   available_tubes.push(new_div_tube_area)
   document.querySelector('[wm-flappy]').appendChild(new_div_tube_area)
}

function slider() {
    for (let tube of available_tubes)
        tube.style.left = `${parseFloat(tube.style.left) - 0.1}%`
    if(parseFloat(available_tubes[0].getBoundingClientRect().left) < -150)
        available_tubes.shift()
}

function flying_bird() {
    let top = bird.getBoundingClientRect().top
    if(top > 115)
        bird.style.top = `${top - 4}px`
    collider()
}

function falling_bird() {
    let top = bird.getBoundingClientRect().top
    if(top < 550)
        bird.style.top = `${top + 4}px`
}

function collider() {
    let bird_pos = bird.getBoundingClientRect()
    for (let tube of available_tubes) {
        let top_tube_pos = tube.children[0].getBoundingClientRect()
        let bottom_tube_pos = tube.children[1].getBoundingClientRect()
        if(tube.getBoundingClientRect().left <= (bird_pos.left + bird_pos.width)){
            if((tube.getBoundingClientRect().left + tube.getBoundingClientRect().width) >= bird_pos.left) {
                if((top_tube_pos.top + top_tube_pos.height) >= bird_pos.top) {
                    stopper()
                }
                else if((bottom_tube_pos.top) <= (bird_pos.top + bird_pos.height)) {
                    stopper()
                }
            }
            else {
                score_updater(tube.id)
            }
        }
    }
}

function stopper() {
    clearInterval(interval_falling_bird)
    clearInterval(interval_flying_bird)
    clearInterval(interval_generator)
    clearInterval(interval_slider)
    clearInterval(interval_collider)
    document.body.onmousedown = e => e.preventDefault();       
    document.body.onmouseup = e => e.preventDefault();
    game_over()
}

function game_over() {
    let game_over_div = document.createElement('div')
    let p_phrase = document.createElement('p')
    let p_score = document.createElement('p')
    let a = document.createElement('a')
    let restart_button = document.createElement('button')
    
    p_phrase.innerHTML = "Game Over"
    p_phrase.style.fontSize = '50px'
    p_score.innerHTML = `score: ${score}`
    restart_button.innerHTML = 'restart'
    restart_button.classList.add('restart-button')
    game_over_div.classList.add('game-over')
    a.setAttribute('href', `${window.location.href}`)
    
    
    a.appendChild(restart_button)
    game_over_div.appendChild(p_phrase)
    game_over_div.appendChild(p_score)
    game_over_div.appendChild(a)
    document.body.appendChild(game_over_div)
}
function score_updater(tube_id) {
    if(!tubes_passed_ids.includes(tube_id)) {
        score++
        score_e.innerHTML = score
        tubes_passed_ids.push(tube_id)
    }
}
function sky_change() {
    let img = document.querySelector('.cloud-sky')
    console.log(score % 5, score % 10)
    if(img.src === "./cloud-sky.jpeg" && score % 5 == 0)
        img.src = "./night-sky.avif"
    else if(img.src === "./night-sky.avif" && score % 10 == 0)
        img.src = "./cloud-sky.jpeg"
}

generates_tubes()
const interval_generator = setInterval(generates_tubes, 1800)
const interval_slider = setInterval(slider, 4)
var interval_falling_bird = setInterval(falling_bird, 20)
var interval_flying_bird

document.body.onmousedown = function () {
    clearInterval(interval_falling_bird)
    interval_flying_bird = setInterval(flying_bird, 20)
}
document.body.onmouseup = function () {
    clearInterval(interval_flying_bird)
    interval_falling_bird = setInterval(falling_bird, 20)
}