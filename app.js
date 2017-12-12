new Vue ({
  el: '#app',
  data: {
    playerHP: 100,
    playerMaxHP: 100,
    monsterName: 'Monster',
    monsterArmor: 0,
    monsterHP: 100,
    monsterMaxHP: 100,
    monsterMinDmg: 0,
    monsterMaxDmg: 0,
    winStreak: 0,
    playerMP: 100,
    playerMaxMP: 100,
    isRunning: false,
    turns: [],
  },
  computed: {
    getPlayerHPPercent() {
      return (this.playerHP / this.playerMaxHP) * 100;
    },
    getPlayerMPPercent() {
      return (this.playerMP / this.playerMaxMP) * 100;
    },
    getMonsterHPPercent() {
      return (this.monsterHP / this.monsterMaxHP) * 100;
    },
  },
  methods: {
    startGame() {
      this.isRunning = true;
      this.winStreak = 0;
      this.initializeHero();
      this.initializeMonster();
    },
    initializeHero() {
      this.playerHP = 100;
      this.playerMaxHP = 100;
      this.playerMP = 100;
      this.playerMaxMP = 100;
    },
    upgradeHero() {
      this.playerMaxHP += 20;
      this.playerHP = this.playerMaxHP - this.playerHP >= 50 ? this.playerHP += 50 : this.playerMaxHP; 
      this.playerMaxMP += 20;
      this.playerMP = this.playerMaxMP - this.playerMP >= 50 ? this.playerMP += 50 : this.playerMaxMP;
      this.winStreak += 1;
    },
    moveToNextLevel() {
      this.upgradeHero();
      this.initializeMonster();
    },
    initializeMonster() {
      const monsterArray = [
        {
          name: 'Cyclops',
          armor: .9,
          health: 90,
          min: 5,
          max: 9,
        },
        {
          name: 'Basilisk',
          armor: 1,
          health: 100,
          min: 5,
          max: 12,
        },
        {
          name: 'Centaur',
          armor: .7,
          health: 70,
          min: 5,
          max: 7,
        },
        {
          name: 'Cyborg Ninja',
          armor: .6,
          health: 60,
          min: 4,
          max: 6,
        },
        {
          name: 'Kobold',
          armor: .5,
          health: 50,
          min: 2,
          max: 5,
        },
        {
          name: 'Goblin',
          armor: .4,
          health: 40,
          min: 1,
          max: 4,
        },
        {
          name: 'Troll',
          armor: .8,
          health: 80,
          min: 4,
          max: 8,
        }
      ];

      const randomMonster = monsterArray[Math.floor(Math.random() * monsterArray.length)];

      this.monsterName = randomMonster.name;
      this.monsterArmor = randomMonster.armor;
      this.monsterHP = randomMonster.health;
      this.monsterMaxHP = randomMonster.health;
      this.monsterMinDmg = randomMonster.min;
      this.monsterMaxDmg = randomMonster.max;
    },
    dmgCalc(min, max) {
      return Math.max(Math.floor(Math.random() * max) + 1, min);
    },
    armorResistCalc(armor) {
      return Math.max(Math.floor(Math.random() * (armor + 1)) + 1, armor - 1);
    },
    checkWin() {
      if (this.monsterHP <= 0) {
        confirm('You won! Continue?') ? this.moveToNextLevel() : this.isRunning = false;
        return true; 
      } else if (this.playerHP <= 0) {
        confirm('You lost! Start a New Game?') ? this.startGame() : this.isRunning = false;
        return true; 
      }
      return false;
    },
    checkMana(cost) {
      return this.playerMP - cost >= 0;
    },
    monsterAtk() {
      let dmg = this.dmgCalc(this.monsterMinDmg, this.monsterMaxDmg);
      this.playerHP -= dmg;
      this.turns.unshift({
        isPlayer: false,
        message: 'Monster attacked player for ' + dmg + ' damage.'
      });
      if (this.playerMP <= 95) {
        this.playerMP += 5;
      }
      else {
        this.playerMP += 100 - this.playerMP;
      }
      this.checkWin();
    },
    regularAtk() {
      let dmg = this.dmgCalc(3, 10) - this.armorResistCalc(this.monsterArmor);
      this.monsterHP -= dmg;
      this.turns.unshift({
        isPlayer: true,
        message: 'Player attacked monster for ' + dmg + ' damage.'
      });
      if (this.checkWin()) {
        return;
      }
      this.monsterAtk();
    },
    specialAtk() {
      if (this.checkMana(25)) {
        this.playerMP -= 25;
        let dmg = this.dmgCalc(1, 20) - this.armorResistCalc(this.monsterArmor);
        this.monsterHP -= dmg;
        this.turns.unshift({
          isPlayer: true,
          message: 'Player attacked monster for ' + dmg + ' special damage.'
        });
        if (this.checkWin()) {
          return;
        }
        this.monsterAtk();
      } else {
        alert('Not enough mana.');
      }
    },
    heal() {
      if (this.checkMana(15)) {
        this.playerMP -= 15;    
        let health = 0;
        this.playerHP <= 90 ? health = 10 : health = 100 - this.playerHP;
        this.playerHP += health;
        this.turns.unshift({
          isPlayer: true,
          message: 'Player healed self for ' + health + ' health.'
        });
        this.monsterAtk();
      } else {
        alert('Not enough mana.');
      }
    },
    giveUp() {
      this.isRunning = false;
    }
  }
});