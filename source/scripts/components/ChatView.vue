<template>
    <div class="ChatView">

        <ul>
            <li v-if="showLastOnly" class="message">{{lastMessage}}</li>
            <li v-else class="message" v-for="message in messages">{{message}}</li>
        </ul>

    </div>
</template>

<script>
import { database } from '../includes/firebase.js'
const messagesDB = database.ref('messages')

export default {
    name: "ChatView",

    computed: {
        lastMessage() {
            return this.messages[this.messages.length - 1] || "..."
        }
    },

    data: () => ({
        showLastOnly: true,
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
        messagesDB.limitToLast(6).on('value', snapshot => {
            let messages = []
            snapshot.forEach((message) => {
                messages.push(message.val())
            })
            this.messages = messages
        })
    }
}
</script>

<style lang="stylus">
.message {
    background: #000;
    width: 100%;
    font-size: 30px;
    color: #fff;
    padding: 20px;
    position: sticky;
    top: 0;
    display: block;
    z-index: 100;
}
</style>