pins.setPull(DigitalPin.P14, PinPullMode.PullUp)
let DEAD_ZONE = 400
let CENTER = 511
let HOLD = 200
let INTERVAL_DEFAULT = 500
let INTERVAL_STEP = 10
let interval = INTERVAL_DEFAULT
let inp = 0
let Enemy: game.LedSprite = null
let Bullet: game.LedSprite = null
let Player: game.LedSprite = null

//////// JOYSTICK CONTROL
basic.forever(function () {
    inp = pins.analogReadPin(AnalogPin.P2)
    if (inp > CENTER + DEAD_ZONE) {
        Player.move(-1)
        pause(HOLD)
    }
    if (inp < CENTER - DEAD_ZONE){
        Player.move(1)
        pause(HOLD)
    }
})

basic.forever(function(){
    if (pins.digitalReadPin(DigitalPin.P14) == 0){
        fire()
    }
})

//////// BUTTONS CONTROL
input.onButtonPressed(Button.A, function () {
    Player.move(1)
})

input.onButtonPressed(Button.AB, function () {
    fire()
})

input.onButtonPressed(Button.B, function () {
    Player.move(-1)
})

//////// FUNCTIONS
function fire() {
    Bullet = game.createSprite(Player.get(LedSpriteProperty.X), Player.get(LedSpriteProperty.Y))
    for (let index = 0; index < 4; index++) {
        Bullet.change(LedSpriteProperty.Y, -1)
        basic.pause(10)
        if (Enemy.isTouching(Bullet)) {
            Enemy.delete()
            Bullet.delete()
            game.addScore(1)
            if (interval - INTERVAL_STEP > 0) {
                interval = interval - INTERVAL_STEP
            }
        }
    }
    Bullet.delete()
    basic.pause(80)
}

function game_over() {
    Player.delete()
    Enemy.delete()
    game.addScore(0)
    pause(100)
    basic.showNumber(game.score())
    game.setScore(0)
    Player = game.createSprite(2, 4)
    interval = INTERVAL_DEFAULT
}

//////// MAIN
Player = game.createSprite(2, 4)
basic.forever(function () {
    Enemy = game.createSprite(randint(0, 4), 0)
    basic.pause(interval)
    for (let index = 0; index < 4; index++) {
        Enemy.change(LedSpriteProperty.Y, 1)
        if (Enemy.isTouching(Player)){
            game_over()
        } else {
            basic.pause(interval)
        }
    }
    Enemy.delete()
})