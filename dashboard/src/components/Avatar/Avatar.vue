<template>
    <div class="profile_image_container">
        <img :src="imgUrl" alt="profile image" class="rounded-circle profile_image" />
        <div class="change_image_button rounded-circle">
            <form>
                <button type="button" @click="changeAvatar" class="btn mr-2 btn-sm btn-link">Change</button>
                <input type="file" ref="avatar" @change="avatarChanged" class="avatar" name="avatar" accept="image/png, image/jpeg">
            </form>
        </div>
    </div>
</template>

<script>
export default {
	name: 'Avatar',
	data(){
		return {
			imgUrl: ''
		}
	},
	props: {
		avatar: String
	},
	watch: {
		avatar: function(newValue){
			this.imgUrl = newValue
		}
	},
    methods: {
        changeAvatar() {
			this.$refs.avatar.click();
		},
		avatarChanged(e) {
            this.imgUrl = URL.createObjectURL(e.target.files[0]);
			this.$emit('save', e.target.files[0]);
		},
    }
}
</script>

<style lang="scss" scoped>
.avatar{
	display: none;
}
.profile_image{
	width: 100%;
    height: 100%;
    object-fit: cover;
}
.change_image_button{
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	opacity: 0;
	transition: .5s ease;
	background-color: #002b49;
}
.profile_image_container{
	height: 100px;
	width: 100px;
	position: relative;
}
.profile_image_container:hover .change_image_button {
	opacity: 0.7;
}
.change_image_button button {
	color: white;
	font-size: 10px;
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	-ms-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
	text-align: center;
  }

</style>