<script setup>
</script>

<template>
    <v-app class="app-background">
      <v-navigation-drawer permanent>
        <v-list-item>
          <div id="logo">
            <img src="./assets/logo.png" alt="Logo" width="50px" height="50px">
            <h1>KANBAN</h1>
          </div>
        </v-list-item>
        <v-list-item link>
          <v-icon>mdi-home</v-icon>
          <a href="">Dashboard</a>
        </v-list-item>
        <v-list-item link>
          <v-icon>mdi-file-cabinet</v-icon>
          <a href="">Inventory</a>
        </v-list-item>
        <v-list-item link>
          <v-icon>mdi-chart-box-outline</v-icon>
          <a href="">Reports</a>
        </v-list-item>
        <v-list-item link>
          <v-icon>mdi-account-circle-outline</v-icon>
          <a href="">Suppliers</a>
        </v-list-item>
        <v-list-item link>
          <v-icon>mdi-package-variant-closed</v-icon>
          <a href="">Orders</a>
        </v-list-item>
        <v-list-item link>
          <v-icon>mdi-clipboard-list-outline</v-icon>
          <a href="">Manage Store</a>
        </v-list-item>
        <v-list>
          <v-list-item link>
            <v-icon>mdi-cog-outline</v-icon>
            <a href="">Settings</a>
          </v-list-item>
          <v-list-item link>
            <v-icon>mdi-logout</v-icon>
            <a href="">Log Out</a>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
      <v-main>
        <h1>cd</h1>
      </v-main>
    </v-app>
</template>

<style scoped>

#logo {
  display: flex;
  color: rgb(0, 140, 255);
  align-items: center;
}

#logo h1 {
  align-items: center;
  font-weight: 500;
  font-size: 19px;
}

.v-list-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 15px;
  color: #555;
}

.v-list-item.active {
  color: rgb(0, 140, 255);
  font-weight: bold;
}

.v-list-item a {
  text-decoration: none;
  color: inherit;
}

.v-divider {
  margin: 10px 0;
}

</style>
