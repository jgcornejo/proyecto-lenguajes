<script>
import { db } from '../firebase.js';
import {collection, addDoc, getDocs, getDoc, updateDoc, doc, query, where} from 'firebase/firestore';

export default{
  name: 'App',
  components: {
  },
  data() {
    return {
      dialog: false,
      showDetails: false,
      selectedProduct: null,
      showEdit: false,
      search: '',
      numeroCategorias: 0,
      totalProductos: 0,
      productImage: '',
      productName: '',
      productId: '',
      productCategory: '',
      productBuyingPrice: '',
      productQuantity: '',
      productUnit: '',
      productExpiryDate: '',
      productThresholdValue: '',
      items: [
      ]
      
    }
  },
  mounted() {
    this.numeroCategorias = this.getCategories();
    this.totalProductos = this.getTotalProducts();
    this.getProducts()
  },
  watch: {
    search(newValue) {
      if (newValue === '' || newValue > 0) {
        this.getProducts()
      } else {
        this.loading = true
      }
    },
    showEdit(newValue) {
      if (newValue) {
        this.fillForm(this.selectedProduct)
      } else {
        this.clearForm()
      }
    }
  },
  methods: {
    getCategories() {
      return this.numeroCategorias;
    },
    getTotalProducts() {
      return this.totalProductos;
    },
    selectProduct(item) {

      this.selectedProduct = item
      this.showDetails = true
      console.log(this.selectedProduct)
    },
    async updateProduct() {
      try {
        
        const existingProductQuery = query(collection(db, 'products'), where('productId', '==', this.selectedProduct.productId)) //hace una consulta
        const docsRef = await getDocs(existingProductQuery) //regresa los documentos que encontro
        
        if(docsRef.empty)
        {
            console.log('El producto que deseas actualizar no existe.')
            return
        }

        const productRef = docsRef.docs[0].ref 
        // Limpia los valores antes de actualizar
        const cleanedQuantity = this.productQuantity.replace(' Packets', '').trim(); 
        const cleanedThresholdValue = this.productThresholdValue.replace(/ Packets/g, '').trim(); 

        await updateDoc(productRef, {
          productImage: this.productImage,
          productName: this.productName,
          productId: this.productId,
          productCategory: this.productCategory,
          productBuyingPrice: this.productBuyingPrice,
          productQuantity: `${cleanedQuantity}`,
          productUnit: this.productUnit,
          productExpiryDate: this.productExpiryDate,
          productThresholdValue: `${cleanedThresholdValue}`,
        });
        console.log("Producto actualizado con ID: ", this.productId);
        this.showEdit = false;
        this.clearForm();
        window.location.reload();
      } catch (e) {
        console.error("Error al actualizar el producto: ", e);
      }
    },
    async fillForm(item) {
      this.productImage = item.productImage;
      this.productName = item.Products;
      this.productId = item.productId;
      this.productCategory = item.productCategory;
      this.productBuyingPrice = item.Buying_Price.replace('$', '').trim(); 
      this.productQuantity = item.Quantity.replace('Packets', '').trim(); 
      this.productUnit = item.Avalability; 
      this.productExpiryDate = item.Expiration_Date;
      this.productThresholdValue = item.Threshold_Value.replace('Packets', '').trim(); 
    },
    clearForm() {
      this.productImage = '';
      this.productName = '';
      this.productId = '';
      this.productCategory = '';
      this.productBuyingPrice = '';
      this.productQuantity = '';
      this.productUnit = '';
      this.productExpiryDate = '';
      this.productThresholdValue = '';
    },
    async submitForm() {
      try {

        // Validar que todos los campos estén llenos
        if (!this.productImage || !this.productName || !this.productId || !this.productCategory || !this.productBuyingPrice || !this.productQuantity || !this.productUnit || !this.productExpiryDate || !this.productThresholdValue) {
          alert("Por favor, completa todos los campos.");
          return;
        }

        // Validar que el ID del producto sea único
        const q = query(collection(db, "products"), where("productId", "==", this.productId));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          alert("El producto ya existe.");
          return;
        }

        const docRef = await addDoc(collection(db, "products"), {
          productImage: this.productImage,
          productName: this.productName,
          productId: this.productId,
          productCategory: this.productCategory,
          productBuyingPrice: this.productBuyingPrice,
          productQuantity: this.productQuantity,
          productUnit: this.productUnit,
          productExpiryDate: this.productExpiryDate,
          productThresholdValue: this.productThresholdValue,
        });

        console.log("Producto guardado con ID: ", docRef.id);

        this.dialog = false;
        this.clearForm();
        window.location.reload();

      } catch (e) {
        console.error("Error al agregar el producto: ", e);
      }
    },
    async getProducts() {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        this.items = [];
        querySnapshot.forEach((doc) => {
          this.items.push({ 
            Products: doc.data().productName,
            Buying_Price: "$ " + doc.data().productBuyingPrice,
            Quantity: doc.data().productQuantity + " Packets",
            Threshold_Value: doc.data().productThresholdValue + " Packets",
            Expiration_Date: doc.data().productExpiryDate,
            Avalability: doc.data().productQuantity > doc.data().productThresholdValue ? "In - Stock" : "Out of stock",
            productImage: doc.data().productImage,
            productCategory: doc.data().productCategory,
            productId: doc.data().productId
          });

          this.totalProductos = this.items.length;
          this.numeroCategorias = new Set(this.items.map(item => item.productCategory)).size;
          
        });
      } catch (e) {
        console.error("Error al obtener los productos: ", e);
      }
    },
    async filterProducts() {
      try {
        const q = query(collection(db, "products"), where("productName", "==", this.search), where("productCategory", "==", this.search));
        const querySnapshot = await getDocs(q)
        this.items = [];
        querySnapshot.forEach((doc) => {
          this.items.push({ 
            Products: doc.data().productName,
            Buying_Price: "$ " + doc.data().productBuyingPrice,
            Quantity: doc.data().productQuantity + " Packets",
            Threshold_Value: doc.data().productThresholdValue + " Packets",
            Expiration_Date: doc.data().productExpiryDate,
            Avalability: doc.data().productQuantity > doc.data().productThresholdValue ? "In - Stock" : "Out of stock",
            productImage: doc.data().productImage,
            productCategory: doc.data().productCategory,
            productId: doc.data().productId
          })
        })
        
      } catch (e) {
        console.error("Error al filtrar los productos: ", e);
      }
    }
    
  }
}
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
          <v-list-item link id="comienzoLista" @click="showDetails = false">
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
        <v-row v-if="!showDetails">
          <v-col>
            <v-card id="tarjeta2">
              <h3 style="margin-bottom: 10px;">Overall Inventory</h3>
              <v-row>
                <v-col>
                  <h4 style="color: rgb(0, 140, 255);">Categories</h4>
                  <span>{{ numeroCategorias}}</span>
                  <h5 style="color: gray; font-weight: 100;">Last 7 days</h5>
                </v-col>
                <v-divider :vertical="true"></v-divider>
                <v-col>
                  <h4 style="color: orange;">Total Products</h4>
                  <v-row>
                    <v-col>
                      <span>{{ totalProductos }}</span>
                      <h5 style="color: gray; font-weight: 100;">Last 7 days</h5>
                    </v-col>
                    <v-col>
                      <span>$25000</span>
                      <h5 style="color: gray; font-weight: 100;">Revenue</h5>
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider :vertical="true"></v-divider>
                <v-col>
                  <h4 style="color: purple;">Top Selling</h4>
                  <v-row>
                    <v-col>
                      <span>5</span>
                      <h5 style="color: gray; font-weight: 100;">Last 7 days</h5>
                    </v-col>
                    <v-col>
                      <span>$2500</span>
                      <h5 style="color: gray; font-weight: 100;">Cost</h5>
                    </v-col>
                  </v-row>
                </v-col>
                <v-divider :vertical="true"></v-divider>
                <v-col>
                  <h4 style="color: red;">Low Stocks</h4>
                  <v-row>
                    <v-col>
                      <span>12</span>
                      <h5 style="color: gray; font-weight: 100;">Ordered</h5>
                    </v-col>
                    <v-col>
                      <span>2</span>
                      <h5 style="color: gray; font-weight: 100;">Not in stock</h5>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              
            </v-card>
          </v-col>
        </v-row>
        <v-row v-if="!showDetails">
          <v-col>
            <v-card id="tarjeta3">
              <v-row>
                <v-col>
                  <div id="tarjeta3Botones">
                    <h3 style="margin-bottom: 10px;">Products</h3>
                    <v-btn color="rgb(0, 140, 255)" style="margin: 0px 10px 0px 10px; text-transform: capitalize;"
                      @click="dialog = true">
                      Add Product
                    </v-btn>
                    <v-btn color="white" style="margin: 0px 10px 0px 10px; text-transform: capitalize;">
                      <v-icon>
                        mdi-filter-variant
                      </v-icon>
                      Filters
                    </v-btn>
                    <v-btn color="white" style="margin: 0px 10px 0px 10px; text-transform: capitalize;">
                      Download all
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row v-if="!showDetails">
                <v-col>
                  
                  <div id="tarjeta3Tabla">
                    <v-data-table 
                      :items="items"
                      dense
                      :items-per-page="4"
                      :search="search"
                      @click:row="selectProduct"
                    >
                    <template v-slot:item="{ item }">
                      <tr @click="selectProduct(item)">
                        <td>{{ item.Products }}</td>
                        <td>{{ item.Buying_Price }}</td>
                        <td>{{ item.Quantity }}</td>
                        <td>{{ item.Threshold_Value }}</td>
                        <td>{{ item.Expiration_Date }}</td>
                        <td>{{ item.Avalability }}</td>
                        <td>
                          <img
                            :src="item.productImage"
                            alt="Product Image"
                            width="50px"
                            height="50px"
                          />
                        </td>
                        <td>{{ item.productCategory }}</td>
                        <td>{{ item.productId }}</td>
                      </tr>
                    </template>

                    </v-data-table>

                  </div>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        
        <!-- TARJETA DE DETALLES -->

        <v-row v-if="showDetails">
          <v-col>
            <v-card id="tarjeta4">
              <v-row>
                <v-col>
                  <div id="tarjeta4Botones">
                    <h3>{{ selectedProduct.Products }}</h3>
                    <v-btn @click="showEdit = true"
                      style="margin-right: 20px;"
                      prepend-icon="mdi-pencil"
                      size="small"
                    >
                      Edit
                    </v-btn>
                    <v-btn
                      size="small"
                    >
                      Download
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <v-col style="padding: 0px 20px 0px 20px;">
                  <div id="tarjeta4Div">
                    <v-list id="tarjeta4Opciones">
                      <v-list-item style="color: rgb(0, 140, 255); 
                        border-bottom: 3px solid rgb(0, 140, 255);"
                      >
                        Overview
                      </v-list-item>
                      <v-list-item>
                        Purchases
                      </v-list-item>
                      <v-list-item>
                        Adjustments
                      </v-list-item>
                      <v-list-item>
                        History
                      </v-list-item>
                    </v-list>
                  </div>
                </v-col>
              </v-row>
              <v-row>
                <div id="tarjeta4Columnas">
                  <v-col id="tarjeta4Columna1" cols="9">
                    <div>
                      <h4>Primary Details</h4>
                      <div style="color: gray; 
                        font-weight: 100; display: flex;
                        margin-top: 20px;
                      ">
                        <v-row>
                          <v-col>
                            <p style="margin-right: 30px;">Product name</p>
                            <p style="margin-right: 30px;">Product ID</p>
                            <p style="margin-right: 30px;">Product Category</p>
                            <p style="margin-right: 30px;">Expiry Date</p>
                            <p style="margin-right: 30px;">Threshold Value</p>
                          </v-col>
                          <v-col>
                            <p>{{ selectedProduct.Products }}</p>
                            <p>{{ selectedProduct.productId }}</p>
                            <p>{{ selectedProduct.productCategory }}</p>
                            <p>{{ selectedProduct.Expiration_Date }}</p>
                            <p>{{ selectedProduct.Threshold_Value }}</p>
                          </v-col>
                        </v-row>
                      </div>

                      <h4 style="margin-top: 10px;">Suplier Details</h4>
                      <div style="color: gray; 
                        font-weight: 100; display: flex;
                        margin-top: 20px;"
                      >
                        <v-row>
                          <v-col>
                            <p style="margin-right: 30px;">Supplier name</p>
                            <p style="margin-right: 30px;">Contact Number</p>
                          </v-col>
                          <v-col>
                            <p>Ronald Martin</p>
                            <p>4647864513</p>
                          </v-col>
                        </v-row>

                      </div>

                      <h4 style="margin-top: 20px;">Stock Locations</h4>
                      <div style="color: gray; 
                        font-weight: 100; display: flex;
                        margin-top: 0px;"
                      >
                        <v-row>
                          <v-col>
                            <v-row 
                              style="background-color: rgb(240, 240, 240);
                              margin: 20px 0px 0px 10px;  
                            ">
                              <v-col>
                                <p style="font-weight: bold;">Store Name</p>
                              </v-col>
                              <v-col>
                                <p style="font-weight: bold; text-align: right; padding-right: 10px;
                                ">Stock in hand</p>
                              </v-col>
                            </v-row>
                            <v-row style="
                              margin: 0px 0px 0px 10px;  
                            ">
                              <v-col>
                                <p>Sulur Branch</p>
                                <p>Singanallur Branch</p>
                              </v-col>
                              <v-col style="text-align: right;">
                                <p style="padding-right: 10px;">15</p>
                                <p style="padding-right: 10px;">19</p>
                              </v-col>
                            </v-row>
                          </v-col>
                        </v-row>
                      </div>  
                      
                    </div>
                  </v-col>
                  <v-col id="tarjeta4Columna2" cols="3">
                    <div style="width: 100%;">
                      <v-row>
                        <v-col>
                          <img
                            :src="selectedProduct.productImage"
                            alt="Product Image"
                            width="150px"
                            height="150px"
                            style="border: 4px dotted lightgray;"
                          />
                        </v-col>
                      </v-row>
                      <v-row style="text-align: left;">
                        <v-col style="color: gray;">
                          <p style="margin-bottom: 5px;">Opening Stock</p>
                          <p style="margin-bottom: 5px;">Remaining Stock</p>
                          <p style="margin-bottom: 5px;">On the way</p>
                          <p style="margin-bottom: 5px;">Threshold value</p>
                        </v-col>
                        <v-col style="text-align: center;">
                          <p style="margin-bottom: 5px;">40</p>
                          <p style="margin-bottom: 5px;">34</p>
                          <p style="margin-bottom: 5px;">15</p>
                          <p style="margin-bottom: 5px;">{{ selectedProduct.Threshold_Value }}</p>
                        </v-col>
                      </v-row>
                    </div>
                  </v-col>
                </div>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <!-- Ventana Emergente -->
        <template>
          <div>
          <v-dialog v-model="dialog" max-width="600px">
            <v-card>
              <h3 style="padding: 20px 0px 10px 20px;">New Product</h3>
              <v-form>
                <v-container>
                  <v-row>
                    <v-col>
                      <div class="campos">
                        <label for="productImage">Product Image</label>
                        <v-text-field
                          id="productImage"
                          v-model="productImage"
                          label="Enter URL Image"
                          required
                        >
                        </v-text-field>
                      </div>
                      <div class="campos">
                        <label for="productName">Product Name</label>
                        <v-text-field
                          id="productName"
                          v-model="productName"
                          label="Enter product name"
                          required
                        >
                        </v-text-field>
                      </div>
                      <div class="campos">
                        <label for="productId">Product ID</label>
                        <v-text-field
                          id="productId"
                          v-model="productId"
                          label="Enter product ID"
                          required
                        >
                        </v-text-field>
                      </div>
                      <div class="campos">
                        <label for="productCategory">Category</label>
                        <v-text-field
                          id="productcategory"
                          v-model="productCategory"
                          label="Select product category"
                          required
                        >
                        </v-text-field>
                      </div>
                      <div class="campos">
                        <label for="productBuyingPrice">Buying Price</label>
                        <v-text-field
                          type="number"
                          id="productBuyingPrice"
                          v-model="productBuyingPrice"
                          label="Enter buying price"
                          required
                        >
                        </v-text-field>
                      </div>
                      <div class="campos">
                        <label for="productQuantity">Quantity</label>
                        <v-text-field
                          id="productQuantity"
                          v-model="productQuantity"
                          label="Enter product quantity"
                          required
                        >
                        </v-text-field>
                      </div>
                      <div class="campos">
                        <label for="productUnit">Unit</label>
                        <v-text-field
                          id="productUnit"
                          v-model="productUnit"
                          label="Enter product unit"
                          required
                        >
                        </v-text-field>
                      </div>
                      <div class="campos">
                        <label for="productExpiryDate">Expiry Date</label>
                        <v-text-field
                          id="productExpiryDate"
                          v-model="productExpiryDate"
                          label="Enter expiry date"
                          required
                        >
                        </v-text-field>
                      </div>
                      <div class="campos">
                        <label for="productThresholdValue">Threshold Value</label>
                        <v-text-field
                          id="productThresholdValue"
                          v-model="productThresholdValue"
                          label="Enter threshold value"
                          required
                        >
                        </v-text-field>
                      </div>
                      
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
              <v-card-actions>
                <v-btn @click="dialog = false" >Discard</v-btn>
                <v-btn color="white" style="background-color: rgb(0, 140, 255);" @click="submitForm">Add Product</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          </div>
        </template>       

        <!-- Ventana Emergente para editar -->
        <template>
          <div>
            <v-dialog v-model="showEdit" max-width="600px">
              <v-card>
                <h3 style="padding: 20px 0px 10px 20px;">New Product</h3>
                <v-form>
                  <v-container>
                    <v-row>
                      <v-col>
                        <div class="campos">
                          <label for="productImage">Product Image</label>
                          <v-text-field
                            id="productImage"
                            v-model="productImage"
                            label="Enter URL Image"
                            required
                          >
                          </v-text-field>
                        </div>
                        <div class="campos">
                          <label for="productName">Product Name</label>
                          <v-text-field
                            id="productName"
                            v-model="productName"
                            label="Enter product name"
                            required
                          >
                          </v-text-field>
                        </div>
                        <div class="campos">
                          <label for="productId">Product ID</label>
                          <v-text-field
                            id="productId"
                            v-model="productId"
                            label="Enter product ID"
                            required
                          >
                          </v-text-field>
                        </div>
                        <div class="campos">
                          <label for="productCategory">Category</label>
                          <v-text-field
                            id="productcategory"
                            v-model="productCategory"
                            label="Select product category"
                            required
                          >
                          </v-text-field>
                        </div>
                        <div class="campos">
                          <label for="productBuyingPrice">Buying Price</label>
                          <v-text-field
                            type="number"
                            id="productBuyingPrice"
                            v-model="productBuyingPrice"
                            label="Enter buying price"
                            required
                          >
                          </v-text-field>
                        </div>
                        <div class="campos">
                          <label for="productQuantity">Quantity</label>
                          <v-text-field
                            id="productQuantity"
                            v-model="productQuantity"
                            label="Enter product quantity"
                            required
                          >
                          </v-text-field>
                        </div>
                        <div class="campos">
                          <label for="productUnit">Unit</label>
                          <v-text-field
                            id="productUnit"
                            v-model="productUnit"
                            label="Enter product unit"
                            required
                          >
                          </v-text-field>
                        </div>
                        <div class="campos">
                          <label for="productExpiryDate">Expiry Date</label>
                          <v-text-field
                            id="productExpiryDate"
                            v-model="productExpiryDate"
                            label="Enter expiry date"
                            required
                          >
                          </v-text-field>
                        </div>
                        <div class="campos">
                          <label for="productThresholdValue">Threshold Value</label>
                          <v-text-field
                            id="productThresholdValue"
                            v-model="productThresholdValue"
                            label="Enter threshold value"
                            required
                          >
                          </v-text-field>
                        </div>
                        
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
                <v-card-actions>
                  <v-btn @click="showEdit = false" >Discard</v-btn>
                  <v-btn color="white" style="background-color: rgb(0, 140, 255);" @click="updateProduct">Update Product</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </template>  
        
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
  font-weight: 900;
  font-size: 17px;
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

#tarjeta2 {
  margin: 0px 20px 0px 20px;
  padding: 20px;
  text-align: left;
}

#tarjeta3 {
  margin: 0px 20px 0px 20px;
  padding: 20px;
  text-align: left;
}

#tarjeta3Botones {
  display: flex;
  align-items: center;
}

#tarjeta3Botones h3 {
  width: 70%;
}

#tarjeta4 {
  margin: 0px 20px 0px 20px;
  padding: 15px;
}

#tarjeta4Div {
  margin: 0;
}

#tarjeta4Botones {
  display: flex;
  align-items: center;
  margin-bottom: 0px;
}

#tarjeta4Botones h3 {
  width: 90%;
}



#tarjeta4Opciones {
  margin-top: 0px;
  display: flex;
  width: 60%;
}

#tarjeta4Opciones .v-list-item {
  margin: 0px 20px 0px 5px;
  text-align: left;
  color: gray;
}

#tarjeta4Columnas {
  width: 100%;
  display: flex;
}

#tarjeta4Columna1 {
  text-align: left;
}

#tarjeta4Columna2 {
  display: flex;
  text-align: center;
  justify-content: center;
  padding-right: 20px;
}

.campos {
  display: flex;
  flex-direction: row;
}


.campos label {
  width: 30%;
  text-align: center;
  align-content: center;
}


</style>
