<template>
  <div class="profile-visibility">
    <span class="profile-visibility__label">{{ label }}</span>
    <i-button
      size="sm"
      :icon="profile.private ? 'eye-slash' : 'eye'"
      :loading="savingProfileVisibility"
      class="profile-visibility__btn"
      @click="changeProfileVisibility"
    />
  </div>
</template>

<script>
import IButton from '@/components/partial/IconButton.vue'

export default {
  components: {
    IButton,
  },
  data() {
    return {
      savingProfileVisibility: false,
    }
  },
  computed: {
    profile() {
      return this.$store.state.auth.profile
    },
    label() {
      let isPrivate = this.profile.private

      if (this.savingProfileVisibility) {
        return `Switching to ${isPrivate ? 'public' : 'private'}...`
      }

      return `Your profile is ${isPrivate ? 'private' : 'public'}`
    },
  },
  methods: {
    changeProfileVisibility() {
      this.savingProfileVisibility = true
      this.$axios
        .get('api/user/update/visibility?private=' + !this.profile.private)
        .then(() => {
          this.savingProfileVisibility = false
          this.profile.private = !this.profile.private
        })
        .catch(() => {
          this.savingProfileVisibility = false
        })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/_variables';

.profile-visibility {
  display: flex;
  position: absolute;
  right: 15px;
  top: 12px;
  align-items: center;
  gap: 7px;

  &__label {
    font-size: 0.72rem;
    color: $cyan;
    opacity: 0;
    letter-spacing: 0.03rem;
    font-weight: 500;
    transition: opacity 0.2s ease;
  }

  &__btn {
    transition: color 0.2s ease;
  }

  &__btn:hover {
    color: white !important;
  }

  &:hover {
    .profile-visibility__btn {
      color: $light-blue;
    }
    .profile-visibility__label {
      opacity: 1;
    }
  }
}
</style>
