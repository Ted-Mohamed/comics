<template>
    <div class="ChatView">
        <button class="historyToggle" @click="showHistory = !showHistory"></button>
        <ul class="messages">
            <li v-if="showHistory" class="message" v-for="message in messages">{{message}}</li>
            <li class="message">{{lastMessage}}</li>
        </ul>
    </div>
</template>

<script>
import { database } from '../includes/firebase.js'
const messagesDB = database.ref('messages')

export default {
    name: "ChatView",

    computed: {},

    data: () => ({
        showHistory: false,
        lastMessage: '...',
        messages: [],
        message: ''
    }),

    methods: {
        sendMessage() {
            if (this.message !== '') {
                messagesDB.push(this.message)
                this.message = ''
            }
        }
    },

    mounted() {
        messagesDB.limitToLast(20).on('value', snapshot => {
            let messages = []
            snapshot.forEach((message) => {
                messages.push(message.val())
            })
            this.lastMessage = messages.pop()
            this.messages = messages
        })
    }
}
</script>

<style lang="stylus">
.ChatView {
    position: relative;
    height: 2.5rem;
    
    .historyToggle {
        position: absolute;
        z-index: 150;
        background: red;
        width: 1rem;
        height: 1rem;
        top: .75rem;
        right: .75rem
    }

    .messages {
        position: absolute;
        z-index: 100;
        width: 100%;
        max-height: 50vh;
        overflow: scroll;
    }
    .message {
        background: #000;
        width: 100%;
        font-size: 1rem;
        line-height: 1.5;
        color: #fff;
        padding: .5rem;
        position: sticky;
        top: 0;
        display: block;
        z-index: 100;
    }
}
</style>