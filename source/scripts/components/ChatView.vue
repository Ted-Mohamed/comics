<template>
    <div class="ChatView">
        <input v-if="showInput" class="message"
               type="text"
               v-model="message"
               @keyup.enter="sendMessage">
        <div v-else="showInput">
            <button class="historyToggle"
                    @click="showHistory = !showHistory"></button>
            <ul class="scrollable messages">
                <li v-if="showHistory"
                    class="message"
                    v-for="message in messages">{{message}}</li>
                <li class="message">{{lastMessage}}</li>
            </ul>
        </div>
    </div>
</template>

<script>
import { database } from '../includes/firebase.js'
const messagesDB = database.ref('messages')

export default {
    name: "ChatView",

    computed: {},
    props: ['showInput'],
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
        background: $highlight-color;
        width: 1rem;
        height: 1rem;
        top: .75rem;
        right: .75rem;
        border-radius: 50%;
    }

    .messages {
        background-color: $backgeound-color;
        position: absolute;
        z-index: 100;
        width: 100%;
        max-height: 50vh;
        overflow: scroll;
    }

    input.message {
        background-color: $backgeound-color;
        border-radius: 0;
    }

    .message {
        width: 100%;
        font-size: 1rem;
        line-height: 1.5;
        color: $text-color;
        padding: .5rem;
        display: block;
    }
}
</style>