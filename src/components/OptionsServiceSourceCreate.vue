<template lang="pug">
  v-dialog(v-model="open" max-width="420px")
    v-form(v-model="valid" ref="form" lazy-validation)
      v-card
        v-card-title
          h2 Create A New Preset
          h4 Also you can manually modify them later.
        v-card-text
          v-text-field(
            name="preset-id"
            label="Preset ID"
            v-model="id"
            :rules="idRules"
            required
            )
          v-text-field(
            name="preset-name"
            label="Preset Name"
            v-model="name"
            :rules="nameRules"
            required
            )
          v-select(
            :items="select"
            label="Inhert Preset"
            v-model="inherit"
            item-value="id"
            item-text="name"
            v-show="select.length"
            )
        v-card-actions
          v-spacer
          v-btn(flat @click="$emit('close', false)") Close
          v-btn(color="primary" flat @click="create") Okay
</template>

<script>
export default {
  name: 'ServiceSourceCreate',
  data () {
    return {
      open: false,
      valid: true,
      id: '',
      idRules: [
        v => !!v || 'Required!',
        v => /^(\d|_|[a-zA-Z])+$/.test(v) || 'Only uppercase and lowercase letters and numbers are supported'
      ],
      name: '',
      nameRules: [v => !!v || 'Required!'],
      inherit: ''
    }
  },
  props: {
    show: {
      type: Boolean,
      required: false,
      default: false
    },
    select: {
      type: Array,
      required: false,
      default () {
        return []
      }
    }
  },
  methods: {
    create (ev) {
      if (this.$refs.form.validate()) {
        this.$emit('create', {
          id: this.id,
          name: this.name,
          inherit: this.inherit
        })

        this.$refs.form.reset()
        this.$emit('close', false)
      }
    }
  },
  watch: {
    open (v) {
      this.$emit('close', v)
      if (!v) this.$refs.form.reset()
    },
    show (v) {
      this.open = v
    }
  }
}
</script>
