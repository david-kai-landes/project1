const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const playerScore  = document.getElementById('score')
const startGameBtn  = document.getElementById('startGameBtn')
const modalEl  = document.getElementById('modalEl')
// console.log(score)

canvas.width = innerWidth
canvas.height = innerHeight

//................. Player .................
class Player {
    constructor(x, y, radius, color) {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
}
//................. Projectile .................
class Projectile {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}
//................. Emenies .................
class Enemy {
    constructor(x, y, radius, color, velocity){
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.velocity = velocity
    }

    draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle = this.color
        c.fill()
    }
    update() {
        this.draw()
        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
    }
}

const x = canvas.width / 2
const y = canvas.height / 2

let player = new Player(x, y, 12, 'yellow') //... player size and color
let projectiles = []
let enemies = []

function init() {
    player = new Player(x, y, 12, 'yellow') //... player size and color
    projectiles = []
    enemies = []
    score = 0
    playerScore.innerHTML = score;
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (22.5 - 8) + 8

        let x
        let y

        if (Math.random() < 0.5) {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius
            y = Math.random() * canvas.height
        } else {
            x = Math.random() * canvas.width
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
        }
        
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`//... Enemies color

        const angle = Math.atan2(canvas.height / 2 - y, 
            canvas.width / 2 - x)
            
            const velocity = {
                x: Math.cos(angle),
                y: Math.sin(angle)
            }
        enemies.push( new Enemy(x, y, radius, color, velocity))
    }, 1000)
}
//................. Animate .................
let animationId
let score = 0;  //... score start
function animate(){
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)' //... background ... 
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    projectiles.forEach((projectile, index) => {
    projectile.update()
//................. Remove from edges of screen ..........
    if(
       projectile.x + projectile.radius < 0 || 
       projectile.x - projectile.radius > canvas.width ||
       projectile.y + projectile.radius < 0 ||
       projectile.y - projectile.radius > canvas.height
       ) {
        setTimeout(() =>{
            projectiles.splice(index, 1)
            }, 0) 
        }
    })

    enemies.forEach((enemy, index) => {
        enemy.update()
        
        const dist =  Math.hypot(player.x - enemy.x, player.y - enemy.y)
        //... End of the game ...
        if (dist - enemy.radius - player.radius < 1){
            cancelAnimationFrame(animationId)
            modalEl.style.display ='flex'
        }
        
        projectiles.forEach((projectile, projectileIndex) => {
            const dist =  Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)

        //... when projectile hit enemy ...
            if (dist - enemy.radius - projectile.radius < 1) //... Collition detection 
            {
            
            if (enemy.radius - 10 > 6) {

                     //... score incresing
            score += 100;
            playerScore.innerHTML = score;

                gsap.to(enemy, {            //... gsap transition ...
                    radius: enemy.radius - 10
                })
                setTimeout(() =>{
                    projectiles.splice(projectileIndex, 1)
                    }, 0)
            } else {
                    //... Bonus Points
            score += 150;
            playerScore.innerHTML = score;

              setTimeout(() =>{
              enemies.splice(index, 1)
              projectiles.splice(projectileIndex, 1)
              }, 0)   
            }
          }
        })
    })
}

addEventListener('click', (event) => {
  const angle = Math.atan2(
      event.clientY - canvas.height / 2, 
      event.clientX - canvas.width / 2
      )
      //... projectiles velocity
      const velocity = {
          x: Math.cos(angle) * 8,
          y: Math.sin(angle) * 8
      }
//................. Projectile size, color and velocity .................
  projectiles.push( new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity))
})

startGameBtn.addEventListener('click', () => {
  init()
  animate()
  spawnEnemies()
  modalEl.style.display ='none'
})
