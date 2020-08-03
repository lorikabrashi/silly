import { shallowMount } from '@vue/test-utils'
import Avatar from "@/components/Avatar/Avatar";

describe('Avatar.vue', () => {
    const propImage = "my_image.jpeg";
    const wrapper = shallowMount(Avatar)
    wrapper.setProps({avatar: propImage})
    
    it('renders', () => {
        expect(wrapper.exists()).toBe(true)
    })
    it('has the right image', () => {
        expect(wrapper.findAll('.profile_image').length).toBe(1)
        expect(wrapper.find('.profile_image').attributes('src')).toBe(propImage)
    })
})
