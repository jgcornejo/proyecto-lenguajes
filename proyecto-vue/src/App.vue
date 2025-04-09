<script setup>
</script>

<template>
    <v-app class="app-background">
      <v-navigation-drawer permanent>
        <v-list id="lista1">
          <v-list-item>
            <div id="logo">
              <img src="./assets/logo.png" alt="Logo" width="50px" height="50px">
              <h1>KANBAN</h1>
            </div>
          </v-list-item>
          <v-list-item link id="comienzoLista">
            <v-icon style="margin-right: 10px;">mdi-home</v-icon>
            <a href="">Dashboard</a>
          </v-list-item>
          <v-list-item link>
            <v-icon style="margin-right: 10px;">mdi-file-cabinet</v-icon>
            <a href="">Inventory</a>
          </v-list-item>
          <v-list-item link>
            <v-icon style="margin-right: 10px;">mdi-chart-box-outline</v-icon>
            <a href="">Reports</a>
          </v-list-item>
          <v-list-item link>
            <v-icon style="margin-right: 10px;">mdi-account-circle-outline</v-icon>
            <a href="">Suppliers</a>
          </v-list-item>
          <v-list-item link>
            <v-icon style="margin-right: 10px;">mdi-package-variant-closed</v-icon>
            <a href="">Orders</a>
          </v-list-item>
          <v-list-item link>
            <v-icon style="margin-right: 10px;">mdi-clipboard-list-outline</v-icon>
            <a href="">Manage Store</a>
          </v-list-item>
        </v-list>
        <v-list id="lista2">
          <v-list-item link>
            <v-icon style="margin-right: 10px;">mdi-cog-outline</v-icon>
            <a href="">Settings</a>
          </v-list-item>
          <v-list-item link>
            <v-icon style="margin-right: 10px;">mdi-logout</v-icon>
            <a href="">Log Out</a>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main>
        <v-row>
          <v-col >
            <v-card>
              <div id="tarjeta1">
                <div id="contenedor-busqueda">
                <v-form>
                  <v-container>
                    <v-text-field
                      id="search"
                      v-model="search"
                      label="Search product, supplier, order"
                      prepend-inner-icon="mdi-magnify"
                    >
                    </v-text-field>
                  </v-container>
                </v-form>
              </div>
              <div id="contenedor-notificacion">
                <v-icon size="30">
                  mdi-bell-outline
                </v-icon>
                <v-icon size="40" style="margin: 0 20px 0 20px;">
                  mdi-account-circle
                </v-icon>
              </div>
              </div>              
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-card id="tarjeta1">
              <h3>Overall Inventory</h3>
              
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            col 2
          </v-col>
        </v-row>
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

#tarjeta1 {
  display: flex;
  flex-direction: row;
  height: 90px;
}

.app-background {
  background-color: rgb(241, 241, 241)
}

#contenedor-busqueda {
  width: 30%;
  justify-content: center;
  align-items: center;
}

#contenedor-notificacion {
  width: 70%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
}

#comienzoLista {
  margin-top: 10%;
}

#lista2{
  margin-top: 90%;
}
</style>
