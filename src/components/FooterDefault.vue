<script setup>
import logoDark from "@/assets/img/logo-ct-dark.png";
import VOY8GER from "@/assets/img/VOY8GER.jpeg";
defineProps({
  brand: {
    type: Object,
    name: String,
    logo: String,
    route: "",
    default: () => ({
      name: "VOY8GER",
      logo: VOY8GER,
      route: "/",
    }),
  },
  socials: {
    type: Array,
    icon: String,
    link: String,
    default: () => [
      {
        icon: '<i class="fab fa-facebook text-lg opacity-8"></i>',
        link: "https://www.facebook.com/singaporefoodie/",
      },
      {
        icon: '<i class="fab fa-twitter text-lg opacity-8"></i>',
        link: "https://twitter.com/foodnetwork?lang=en",
      },
      {
        icon: '<i class="fab fa-instagram text-lg opacity-8"></i>',
        link: "https://www.instagram.com/singapore.foodie/",
      },
      {
        icon: '<i class="fab fa-youtube text-lg opacity-8"></i>',
        link: "https://youtu.be/L8sPZIkKywA?si=gmIcGRTM4ZSU3We2",
      },
    ],
  },
  menus: {
    type: Array,
    name: String,
    items: {
      type: Array,
      name: String,
      href: String,
    },
    default: () => [
      {
        name: "company",
        items: [
          {
            name: "about us",
            href: "/about-us",
          },

          {
            name: "premium tools",
            href: "https://www.travelperk.com/business-travel/business-travel-management-global-1/?utm_source=google&utm_medium=cpc&utm_campaign=1250_G_SG_EN_GEN_PM_TravelManagement&utm_term=travel%20management%20tool&utm_content=&hl1=&gad_source=1&gclid=CjwKCAjwh4-wBhB3EiwAeJsppIfocPecGbpc2Ro-fsWhRXXjzoHtEveCvF507b--Vxwq2YbQmnd0xxoCMNYQAvD_BwE",
          },
          { name: "blog", href: "https://eatbook.sg/" },
        ],
      },
      {
        name: "resources",
        items: [
          {
            name: "affiliate program",
            href: "https://affiliates.expediagroup.com/en-us/home",
          },
        ],
      },
      {
        name: "help & support",
        items: [
          {
            name: "contact us",
            href: "/contact-us",
          },

          {
            name: "knowledge center",
            href: "https://www.tripadvisor.com.sg/",
          },
          {
            name: "sponsorships",
            href: "https://www.traveltechasia.com/sponsorship",
          },
        ],
      },
      {
        name: "legal",
        items: [
          {
            name: "terms & conditions",
            href: "https://www.termsfeed.com/blog/sample-terms-and-conditions-template/",
          },
          {
            name: "privacy policy",
            href: "https://termly.io/resources/templates/privacy-policy-template/",
          },
          {
            name: "licenses (EULA)",
            href: "https://www.pandadoc.com/license-agreement-template/",
          },
        ],
      },
    ],
  },
});
</script>
<template>
  <footer class="footer pt-5 mt-5">
    <div class="container">
      <div class="row">
        <div class="col-md-3 mb-4 ms-auto">
          <div>
            <a :href="brand.route">
              <img :src="brand.logo" class="mb-3 footer-logo" alt="main_logo" />
            </a>
            <h6 class="font-weight-bolder mb-4">{{ brand.name }}</h6>
          </div>
          <div>
            <ul class="d-flex flex-row ms-n3 nav">
              <li
                class="nav-item"
                v-for="{ icon, link } of socials"
                :key="link"
              >
                <a
                  class="nav-link pe-1"
                  :href="link"
                  target="_blank"
                  v-html="icon"
                >
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div
          class="col-md-2 col-sm-6 col-6 mb-4"
          v-for="{ name, items } of menus"
          :key="name"
        >
          <h6 class="text-sm">{{ name }}</h6>
          <ul class="flex-column ms-n3 nav">
            <li class="nav-item" v-for="item of items" :key="item.name">
              <a class="nav-link" :href="item.href" target="_blank">
                {{ item.name }}
              </a>
            </li>
          </ul>
        </div>

        <div class="col-12">
          <div class="text-center">
            <p class="text-dark my-4 text-sm font-weight-normal">
              All rights reserved. Copyright ©
              {{ new Date().getFullYear() }}
              VOY8GER by
              <a href="https://www.creative-tim.com" target="_blank"
                >BT3103 Team 13</a
              >.
            </p>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
