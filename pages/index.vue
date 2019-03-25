<template>
  <v-container style="height:100%">
    <v-layout row justify-center>
      <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
          <v-toolbar dark color="primary">
            <v-btn icon dark @click="dialog = false">
              <v-icon>close</v-icon>
            </v-btn>
            <v-toolbar-title>Create todo</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-toolbar-items>
              <v-btn dark flat @click="addTask">Save</v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <v-container>
            <v-list three-line subheader>
              <v-layout wrap>
                <v-flex sm12>
                  <v-text-field label="Name of todo" v-model="newTask.name" @keypress.enter="addTask"></v-text-field>
                  <v-text-field label="Description todo" v-model="newTask.description"></v-text-field>
                  <v-layout wrap>
                    <v-flex xs12 md10 wrap="">
                      <v-menu ref="menu" :close-on-content-click="false" v-model="menu" :nudge-right="40"
                        :return-value.sync="newTask.dates" lazy transition="scale-transition" offset-y full-width
                        min-width="290px" :disabled="newTask.everyDay">
                        <v-combobox slot="activator" v-model="newTask.dates" multiple chips small-chips label="Show notifications these days"
                          hint="You have a notice displayed on these days." prepend-icon="event" readonly :disabled="newTask.everyDay"></v-combobox>
                        <v-date-picker v-model="newTask.dates" multiple no-title scrollable locale="ru">
                          <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                          <v-spacer></v-spacer>
                          <v-btn flat color="green" @click="$refs.menu.save(newTask.dates)">Ok</v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex xs12 md2>
                      <v-checkbox type="radio" v-model="newTask.everyDay" label="constantly todo"></v-checkbox>
                    </v-flex>
                  </v-layout>
                  <v-menu :close-on-content-click="false" v-model="menu2" :nudge-right="40" lazy transition="scale-transition"
                    offset-y full-width min-width="290px">
                    <v-text-field slot="activator" v-model="newTask.date" label="end date" hint="The date after which the task will be considered unfulfilled"
                      prepend-icon="event_available" readonly></v-text-field>
                    <v-date-picker v-model="newTask.date" @input="menu2 = false"></v-date-picker>
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-layout wrap>
                <v-flex xs12 md4 class="mr-4">
                  <v-combobox v-model="newTask.categories" :items="categoriesList" :search-input.sync="search" label="Add the category"
                    persistent-hint small-chips multiple>
                    <template slot="no-data">
                      <v-list-tile-content>
                        <v-list-tile-title>
                          Result of search is empty "
                          <strong>{{ search }}</strong>". Press
                          <kbd>enter</kbd> to add new category
                        </v-list-tile-title>
                      </v-list-tile-content>
                    </template>
                  </v-combobox>
                </v-flex>
                <v-flex xs12 sm6 md3 lg3 xl2>
                  <v-btn block  @click="trigColor">Choose label color<div class="circle ml-2" :style="'background-color:' + col"></div></v-btn> 
                </v-flex>
                <v-spacer></v-spacer>
                <v-flex xs12 sm6 md4 lg3 xl2>
                  <v-btn block color="success" @click="addTask">Save</v-btn>
                </v-flex>
              </v-layout>
            </v-list>
          </v-container>
        </v-card>
      </v-dialog>
    </v-layout>

    <!-- {{doneTasks}} -->
    <transition name="fade" mode="out-in">
      <v-list style="background-color:unset" v-if="tasks.length >=1" >
      <transition-group name="list"> 
          <v-list-tile :color="value.stickerColor" class="listItem" v-for="(value, i) in tasks" :key='value.id'>
            <v-list-tile-action>
              <v-checkbox :color="value.stickerColor" v-model="value.done" @change="updCheckBox(i)"></v-checkbox>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title >{{value.name}}</v-list-tile-title>
              <v-list-tile-sub-title>{{value.description}}</v-list-tile-sub-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn flat icon @click="updStars(value)">
                <v-icon
                  :color="!value.star ? 'grey lighten-1' : 'yellow darken-2'"
                >
                  {{!value.star ? "star_border" : "star"}}
                </v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
      </transition-group>
      </v-list>
      <v-layout v-else align-center justify-center row fill-height>
          <h3 class="mb-5">You have no todo tasks yet! <v-btn @click="generateFake(10)">generate fake todo</v-btn></h3>
      </v-layout>
    </transition>
    <v-btn :class="tasks.length>=1 ? '' : 'pulse'" color="pink" dark fixed right bottom fab @click="dialog=true" title="Создать задачу">
      <v-icon>add</v-icon>
    </v-btn>
   <input ref="color" type="color" v-model="col" style="display:none">
  </v-container>
</template>

<script>
  import faker from 'faker/locale/ru'
  
  export default {
    data () {
      return {
        dialog: false,
        menu: false,
        menu2: false,
        col: '#ffffff',
        search: '',
        categoriesList: ['Other', 'Purchases', 'Job', 'A wish list', 'Target'],
        newTask: {
          name: '',
          description: '',
          dates: [],
          date: '',
          everyDay: false,
          categories: [],
          star: false,
          done: false,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
        }
      }
    },
    computed: {
      tasks () {
        return this.$store.getters.getTasks
      },
      doneTasks () {
        return this.$store.getters.getDoneTasks
      }
    },
    watch: {
      tasks () {
        console.log(this.tasks)
        this.updTasksStorage()
      },
      doneTasks () {
        this.updDoneTasksStorage()
      }
    },
    methods: {
      updTasksStorage () {
        localStorage.tasks = JSON.stringify(this.tasks)
      },
      updDoneTasksStorage () {
        localStorage.doneTasks = JSON.stringify(this.doneTasks)
      },
      updStars (value) {
        value.star = !value.star
        let sortedStars = this.$store.getters.getTasks.sort((a, b) => {
          return (a.star - b.star) * -1
        })
        this.$store.dispatch('setTasks', sortedStars)
        // this.updTasksStorage()
      },
      updCheckBox (i) {
        this.$store.dispatch('setMessageToClient', { message: 'Perfectly, todo complite!', type: 'success' })
        setTimeout(() => {
          let doneTask = this.tasks.splice(i, 1)[0]
          this.$store.dispatch('pushDoneTasks', doneTask)
        }, 10)
        this.updTasksStorage()
      },
      trigColor () {
        this.$refs.color.click()
      },
      addTask (fake) {
        if (this.newTask.name.length > 4) {
          let newTask = this.newTask
          newTask.stickerColor = this.col
          this.tasks.push(newTask)
          this.$store.dispatch('setMessageToClient', { message: 'Todo is added', type: 'info' })
          this.clear()
        } else if (!fake) {
          this.$store.dispatch('setMessageToClient', { message: 'Please write the name of todo', type: '' })
        }
      },
      clear () {
        this.newTask = {
          name: '',
          description: '',
          dates: [],
          date: '',
          everyDay: false,
          categories: [],
          star: false,
          done: false,
          id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
        }
        // this.dialog = false
      },
      generateFake (n) {
        for (let i = 0; i < n; i++) {
          this.col = faker.internet.color()
          this.newTask.name = faker.lorem.text()
          this.newTask.description = faker.name.lastName()
          this.addTask(true)
        }
      }
    },
    mounted () {
      this.$store.dispatch('setLoading', false)
      // localStorage.clear()
      if (localStorage.tasks) {
        this.$store.dispatch('setTasks', JSON.parse(localStorage.tasks))
      }
      if (localStorage.doneTasks) {
        this.$store.dispatch('setDoneTasks', JSON.parse(localStorage.doneTasks))
      }
    }
  }
</script>

<style lang="scss">
html {
    overflow-y: auto !important;
}

.circle{
  border-radius: 50%;
  border: 1px solid black;
  width:20px;
  height:20px;
}
.listItem:hover .sticker{
  opacity: 1;
}
  .pulse{
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(236, 56, 117, 0.7);
  }
  70% {
      box-shadow: 0 0 0 30px rgba(236, 56, 117, 0);
  }
  100% {
      box-shadow: 0 0 0 0 rgba(236, 56, 117, 0);
  }
}


.list-enter-active, .list-leave-active {
  transition: all 1s ease;
}
.list-enter{
  opacity: 0;
  transform: translateY(30px);
}
.list-leave-to {
  animation: translatex 4s;
  /* transform: translateX(30px); */
}

.list-move {
  transition: all 0.5s ease;
}

@keyframes translatex {
  0%{
    transform: translateX(0);
  }
  50%{
    transform: translateX(0);
    opacity: 1;
  }
  100%{
    transform: translateX(30px);
    opacity: 0;
  }
}
.fade-enter-active {
  transition: all .7s ease;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

</style>
