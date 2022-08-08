kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    clearColor: [0,0,0,1]
})
let isJumping = true
let isBig = false
loadRoot("https://i.imgur.com/")

backgroundColor = 'green';

loadSprite('bloco', 'cJDmWHQ.png') 
loadSprite('goomba', 'cJDmWHQ.png')
loadSprite('surpresa', 'dzA4WTf.png')
loadSprite('unboxed', 'Wx34agV.png')
loadSprite('moeda', 'fNfBNrX.png') //https://imgur.com/fNfBNrX
loadSprite('covid', 'XO996fQ.png') //XO996fQ.
loadSprite('mascara', 'lvVI2OU.png')
loadSprite('tijolo', 'ixmeTWy.png')
loadSprite('player', 's1WIVoX.png')
loadSprite('alcool', 'fNfBNrX.png',) //{
///////////////////////////////////
loadSprite('bloco2', 'PsAFbRm.png')
loadSprite('surpresa2', 'sWM4uOV.png')
loadSprite('chão2', 'fah1OG2.png')
loadSprite('tubo-top-left', 'eeSLQZQ.png')
//////////////////////////////////
loadSprite('bloco3', 'wsCn3fS.png')
loadSprite('surpresa3', 'QRzMEna.png')
loadSprite('chão3', 'Jpzbiqc.png')

scene("game", ({ level, score, big }) => {
    layer(["bg","obj", "ui"], "obj")

    const maps = [
    [
    '~                                      ~ ',
    '~                                      ~ ',
    '~                                      ~ ',
    '~                                      ~ ',
    '~                                      ~ ',
    '~                                      ~ ',
    '~     %              ~%~*~             ~ ',
    '~                                      ~ ',
    '~                                   +  ~ ',
    '~                 ^         ^          ~ ',
    '========================================',
    ],
    [
      '!                                    ! ',
      '!                                    ! ',
      '!                                    ! ',
      '!                                    ! ',
      '!                                    ! ',
      '!                                    ! ',
      '! @xxx@             x  x             ! ',
      '!                x  x  x  x          ! ',
      '!             x  x  x  x  x  x    +  ! ',
      '!      ^  ^ x x  x  x  x  x  x x     ! ',
      '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
      ],
      [
        '&                                   &',
        '&                                   &',
        '&                                   &',
        '&                                   &',
        '&                                   &',
        '&                ???/??/???         &',
        '& ??                                &',
        '&                                   &',
        '&      ??        ?/??????/?     +   &',
        '&                ^     ^     ^      &',
        '&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&',
        ],
    ]



    const levelcfg = {
       width: 16,
      height: 16,
      '=': [sprite('bloco'), solid()], 
      '~': [sprite('tijolo'), solid()], 
      '%': [sprite('surpresa'), solid(), 'alcool-surpresa'], 
      '*': [sprite('surpresa'), solid(), 'mascara-surpresa'], 
      '}': [sprite('unboxed'), solid()], 
      '^': [sprite('covid'), 'dangerous'],
      '$': [sprite('alcool'), 'alcool'],
      '#': [sprite('mascara'), 'mascara', body()],
      '!': [sprite('chão2'), solid()], 
      '@': [sprite('surpresa2'), solid(), 'alcool-surpresa2'], 
      'x': [sprite('bloco2'), solid()],
      '+': [sprite('tubo-top-left'), solid(), 'tubo', scale(1)], 
      '&': [sprite('chão3'), solid()],
      '?': [sprite('bloco3'), solid()],
      '/': [sprite('surpresa3'), solid(), 'alcool-surpresa3'], 




    }

 const gameLevel = addLevel(maps[level], levelcfg) 

 const scoreLabel = add ([
  text('alcool gel: ' +score, 10),
  pos(12,5),
  layer('ui'),
  {
    value: score
  }
 ])

 add([text('level: ' +parseInt(level + 1), 10), pos(12,30)])

function big(){
  return{
    isBig(){
      return isBig
    },
    smallify(){
        this.scale = vec2(1)
        isBig = false
    },
    biggify(){
      this.scale = vec2(1.5)
      isBig = true
    }
  }
}

   const player = add([
       sprite('player', {

        animSpeed: 0.1,
        frame: 0

       }),
      
      solid(),
      body(),
      big(),
      pos(60,0),
      origin('bot'),
   ])

   if(isBig){
    player.biggify
   }

   keyDown('left', () => {
    player.flipX(true)
    player.move(-120,0)
  })

  keyDown('right', () => {
    player.flipX(false)
    player.move(120,0)
  })

  keyPress('space', () => {
  if(player.grounded()){
      player.jump(350)
      isJumping = true
    } 
  })

    //keyDown('left', () => {
      //player.flipX(true)
     // player.play('move')
   // })

    //keyDown('right', () => {
    //  player.play('move')
    //})
  

  

  action('dangerous', (obj) => {
      obj.move(-20,0)
  })
  
  player.action(() => {
      if(player.grounded()){
          isJumping = false
       } 
    })
    
    
    player.on('headbutt', (obj) => {
        if(obj.is('alcool-surpresa')){
        gameLevel.spawn('$', obj.gridPos.sub(1))
        destroy(obj)
        gameLevel.spawn('}', obj.gridPos.sub(0.0))
        }

        if(obj.is('alcool-surpresa2')){
          gameLevel.spawn('$', obj.gridPos.sub(1))
          destroy(obj)
          gameLevel.spawn('}', obj.gridPos.sub(0.0))
          }

          if(obj.is('alcool-surpresa3')){
            gameLevel.spawn('$', obj.gridPos.sub(1))
            destroy(obj)
            gameLevel.spawn('}', obj.gridPos.sub(0.0))
            }

        if(obj.is('mascara-surpresa')){
          gameLevel.spawn('#', obj.gridPos.sub(1))
          destroy(obj)
          gameLevel.spawn('}', obj.gridPos.sub(0.0))
          }

    })
      

    action('mascara', (obj) => {
      obj.move(30.0)
    })

    player.collides('mascara', (obj) => {
      destroy(obj)
      player.biggify()
    })

    player.collides('dangerous', (obj) =>{
      if(isJumping){
        destroy(obj)
      }else{
        if(isBig){
          player.smallify()
          }else{
            go("Perdeu", ({score: scoreLabel.value}))
          }
          
      }
    
    })

    player.collides('alcool', (obj) => {
      destroy(obj)
      scoreLabel.value++
      scoreLabel.text = 'Alcool gel: ' +scoreLabel.value
    })

    player.collides('tubo', () => {
      keyPress('down', () => {
        go("game", {
          level: (level + 1) % maps.length,
          score: scoreLabel.value,
          Big: isBig
        })
      })
    })
})

scene("Perdeu", ({score}) => {
  add([ text('Pontos: ' +score, 18), origin('center'), pos(width()/2, height()/2 )])
  keyPress('space', () => {
    go("game", {level: 0, score: 0, big: isBig})
  })
})



go("game", ({ level: 0, score: 0, Big: isBig }))