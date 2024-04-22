import { describe, it, expect, beforeEach, afterEach, test } from 'vitest'

import { mount, shallowMount  } from '@vue/test-utils'
import Login from '../../views/Auth/Login.vue'
import App from "../../App.vue"
import { createApp } from "vue";
import { createPinia } from "pinia";
import Toaster from "@meforma/vue-toaster";

// import router from "../../router/index.js";
import materialKit from "../../material-kit.js"
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'

describe('test1', async () => {
  // set up route to that page
  const router = createRouter({
    history:createWebHistory(),
    routes: [{
        path:"/login",
        name: "login",
        component: Login
    }]
  })
  router.push('/login')
  await router.isReady()

  // set up our vue app instance
  const app = createApp(App);
  const vuetify = createVuetify({components,directives})
  app.use(createPinia());
  app.use(router);
  app.use(materialKit);
  app.use(Toaster, {
    position: "top",
    dismissable: "true",
    maxToasts: 1,
  });
  app.use(vuetify);

  // create wrapper instance of app with router to test
  const wrapper = mount(App, {
    global: {
      plugins: [router]
    }
  })

  // DEFINE TESTS on vue instance here 
  it('Checks if SignIn button is available', () => {
    expect(wrapper.html()).toContain('Sign in')
  }),

  it('Checks if user can sign in to main page', async () => {
    
    const emailInput = wrapper.find('#email');
    const passwordInput = wrapper.find('#password');
    console.log(wrapper.find('#email')) 

    // Set email and password values
    await emailInput.setValue('ramanenb@gmail.com');
    await passwordInput.setValue('123456');
    console.log(wrapper.find('#email')) 

    // Trigger form submission
    await wrapper.find("#matbutton").trigger("click");

    // Check if login-success event was emitted
    expect(wrapper.emitted('login-success')).toBeTruthy();
  }),

  it('if user tries to signin w/o any details', () => {

    // Trigger form submission ---> again it says that the wrapper is empty
    wrapper.find('#matbutton').trigger('click')

    // Check if login-success event was emitted
    expect(wrapper.emitted('login-success')).toBeFalsy();
  })

})
