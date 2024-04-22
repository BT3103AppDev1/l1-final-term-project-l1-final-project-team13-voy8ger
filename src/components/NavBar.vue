<template>
  <nav>
    <ul>
      <li><a href="#">Explore</a></li>
      <li><a href="#">Profile</a></li>
      <li><a href="#">Create</a></li>
      <li><a href="#">Favourites</a></li>
    </ul>
  </nav>
</template>

<style>
/* Resetting default margin and padding for list */
ul {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

/* Styling navigation links */
nav ul {
  background-color: #333; /* Background color of the navigation bar */
  overflow: hidden;
}

nav ul li {
  float: left;
}

nav ul li a {
  display: block;
  color: white; /* Text color of the links */
  text-align: center;
  padding: 14px 16px; /* Padding for the links */
  text-decoration: none;
}

nav ul li a:hover {
  background-color: #555; /* Background color of the links on hover */
}
</style>
