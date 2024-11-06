<!-- Shop.vue -->
<template>
  <div class="shop-section">
    <h4>The Shopkeeper...</h4>
    <div class="shop-container">
      <img src="/assets/shop/storekeeper.gif" width="150px" height="150px" />
      <div class="row" style="justify-content: center; align-items: center; text-align: center">
        <div v-for="item in shopitems" :key="item.itemname" class="col-4">
          <img
            v-bind:src="item.imgpath"
            width="80px"
            style="cursor: pointer"
            @click="openModal(item)"
          />
          <p>{{ item.itemname }}</p>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="isModalOpen" class="modal-overlay" id="itemModal">
      <div class="modal-content">
        <h1 class="fs-5" id="itemModalLabel">{{ selectedItem.itemname }}</h1>
        <button type="button" class="btn-close" @click="closeModal"></button>
        <img
          :src="selectedItem.imgpath"
          width="150px"
          height="150px"
          class="d-block mx-auto mb-3"
        />
        <p>{{ selectedItem.itemdesc }}</p>
        <div v-if="selectedItem.itemname === 'Regular Fish'">
          <p>You have {{ regularFishQty }} in your Inventory!</p>
        </div>
        <div v-if="selectedItem.itemname === 'Rare Fish'">
          <p>You have {{ rareFishQty }} in your Inventory!</p>
        </div>
        <div v-if="selectedItem.itemname === 'Ultra Fish'">
          <p>You have {{ ultraFishQty }} in your Inventory!</p>
        </div>

        <!-- Quantity Selector -->
        <div v-if="selectedItem.itemname?.includes('Fish')" class="quantity-selector">
          <button @click="decreaseQty">-</button>
          <input type="number" v-model="itemqty" min="1" />
          <button @click="increaseQty">+</button>
        </div>

        <p><strong>Cost:</strong> {{ totalCost }} coins</p>

        <!-- Purchase Button or Ownership Message -->
        <div v-if="backgroundOwned || catOwned">
          <button type="button" class="btn btn-secondary" disabled>
            You already own this {{ selectedItem.itemtype.toLowerCase() }}!
          </button>
        </div>
        <div v-else>
          <button
            v-if="canAfford"
            type="button"
            class="btn btn-primary w-100"
            style="background-color: #d2691e"
            @click="buyItem"
          >
            Purchase
          </button>
          <button v-else type="button" class="btn btn-danger" disabled>Not enough coins!</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

export default {
  name: 'Shop',
  props: {
    userPoints: {
      type: Number,
      required: true
    }
  },
  emits: ['points-updated'],
  data() {
    return {
      regularFishQty: 0,
      rareFishQty: 0,
      ultraFishQty: 0,
      catOwned: false,
      backgroundOwned: false,
      shopitems: [
        {
          itemname: 'Regular Fish',
          itemcost: 10,
          itemtype: 'Fish',
          itemdesc:
            "Caught in the deep blue sea, this fish will regenerate 10 of your cat's happiness!",
          imgpath: '/assets/shop/fish1.png'
        },
        {
          itemname: 'Rare Fish',
          itemcost: 15,
          itemtype: 'Fish',
          itemdesc:
            "Caught in the deep blue sea, this fish will regenerate 15 of your cat's happiness!",
          imgpath: '/assets/shop/fish2.png'
        },
        {
          itemname: 'Ultra Fish',
          itemcost: 20,
          itemtype: 'Fish',
          itemdesc:
            "Caught in the deep blue sea, this fish will regenerate 20 of your cat's happiness!",
          imgpath: '/assets/shop/fish3.png'
        },
        {
          itemname: 'Beach',
          itemcost: 50,
          itemtype: 'Background',
          itemdesc: 'Switch up your room with this all new background!',
          imgpath: '/assets/shop/beach.gif'
        },
        {
          itemname: 'Christmas',
          itemcost: 110,
          itemtype: 'Background',
          itemdesc: 'Switch up your room with this all new background!',
          imgpath: '/assets/shop/christmas.gif'
        },
        {
          itemname: 'Park',
          itemcost: 200,
          itemtype: 'Background',
          itemdesc: 'Switch up your room with this all new background!',
          imgpath: '/assets/shop/park.gif'
        },
        {
          itemname: 'Siamese',
          itemcost: 1000,
          itemtype: 'Cat',
          itemdesc: 'Change your cat type to Siamese!',
          imgpath: '/assets/shop/Siamese.gif'
        },
        {
          itemname: 'Charcoal',
          itemcost: 1000,
          itemtype: 'Cat',
          itemdesc: 'Change your cat type to Black!',
          imgpath: '/assets/shop/Black.gif'
        },
        {
          itemname: 'Pinkie',
          itemcost: 1000,
          itemtype: 'Cat',
          itemdesc: 'Change your cat type to Pinkie!',
          imgpath: '/assets/shop/Pinkie.gif'
        }
      ],
      itemqty: 1,
      isModalOpen: false,
      selectedItem: {}
    }
  },
  computed: {
    totalCost() {
      return this.selectedItem.itemcost * this.itemqty
    },
    canAfford() {
      return this.userPoints >= this.totalCost
    }
  },
  methods: {
    fetchUserInventory() {
      const username = localStorage.getItem('username')

      // API call to fetch user inventory
      axios
        .get(`http://localhost:8000/api/userinventory/${username}`)
        .then((response) => {
          const inventory = response.data
          console.log(inventory)
          // Find quantities of each type of fish
          inventory.forEach((item) => {
            if (item.itemname === 'Regular Fish') {
              this.regularFishQty = item.itemqty
            } else if (item.itemname === 'Rare Fish') {
              this.rareFishQty = item.itemqty
            } else if (item.itemname === 'Ultra Fish') {
              this.ultraFishQty = item.itemqty
            }
          })
        })
        .catch((error) => {
          console.error('Error fetching user inventory:', error)
        })
    },
    buyItem() {
      const username = localStorage.getItem('username') || 'anonymous'
      const totalCost = this.selectedItem.itemcost * this.itemqty

      axios
        .put(`http://localhost:8000/api/users/${username}/deduct-points`, {
          pointsToDeduct: totalCost
        })
        .then((response) => {
          console.log('Points deducted successfully')
          this.$emit('points-updated', -totalCost)
          this.updateInventory(username)

          // Set ownership flags instead of removing item from shop
          if (this.selectedItem.itemtype === 'Background') {
            this.backgroundOwned = true
          } else if (this.selectedItem.itemtype === 'Cat') {
            this.catOwned = true
          }

          this.closeModal()
          toast(`${this.itemqty} x ${this.selectedItem.itemname} was added to your Inventory!`, {
            icon: '🚀',
            autoClose: 1000
          })
        })
        .catch((error) => {
          console.error('Error deducting points:', error)
        })
    },

    async updateInventory(username) {
      try {
        const response = await axios.get(`http://localhost:8000/api/userinventory/${username}`)
        const inventory = response.data

        const existingItem = inventory.find((item) => item.itemname === this.selectedItem.itemname)

        if (existingItem) {
          await axios.put(`http://localhost:8000/api/inventory/update`, {
            username: username,
            itemname: this.selectedItem.itemname,
            itemqty: existingItem.itemqty + this.itemqty
          })
          console.log('Item quantity updated successfully')
        } else {
          await axios.post('http://localhost:8000/api/inventory/add', {
            username: username,
            itemname: this.selectedItem.itemname,
            itemtype: this.selectedItem.itemtype,
            itemdesc: this.selectedItem.itemdesc,
            itemqty: this.itemqty,
            imgpath: this.selectedItem.imgpath
          })
          console.log('New item added successfully')
        }
      } catch (error) {
        console.error('Error updating inventory:', error)
      }
    },

    increaseQty() {
      this.itemqty++
    },
    decreaseQty() {
      if (this.itemqty > 1) {
        this.itemqty--
      }
    },
    openModal(item) {
      this.selectedItem = item
      this.isModalOpen = true
      this.itemqty = 1
      this.backgroundOwned = false
      this.catOwned = false

      const username = localStorage.getItem('username')

      // Fetch user inventory and check if they already own the selected background or cat
      axios
        .get(`http://localhost:8000/api/userinventory/${username}`)
        .then((response) => {
          const inventory = response.data

          if (this.selectedItem.itemtype === 'Background') {
            this.backgroundOwned = inventory.some(
              (inventoryItem) => inventoryItem.imgpath === this.selectedItem.imgpath
            )
          } else if (this.selectedItem.itemtype === 'Cat') {
            this.catOwned = inventory.some(
              (inventoryItem) => inventoryItem.itemname === this.selectedItem.itemname
            )
          }

          // Update inventory counts if the selected item is a type of fish
          inventory.forEach((item) => {
            if (item.itemname === 'Regular Fish') {
              this.regularFishQty = item.itemqty
            } else if (item.itemname === 'Rare Fish') {
              this.rareFishQty = item.itemqty
            } else if (item.itemname === 'Ultra Fish') {
              this.ultraFishQty = item.itemqty
            }
          })
        })
        .catch((error) => {
          console.error('Error fetching user inventory:', error)
        })
    },

    closeModal() {
      this.isModalOpen = false
    }
  },
  mounted() {
    const username = localStorage.getItem('username') || 'anonymous'

    axios
      .get(`http://localhost:8000/api/userinventory/${username}`)
      .then((response) => {
        const inventory = response.data

        // Keeping all items in the shop
        inventory.forEach((item) => {
          if (item.itemname === 'Regular Fish') {
            this.regularFishQty = item.itemqty
          } else if (item.itemname === 'Rare Fish') {
            this.rareFishQty = item.itemqty
          } else if (item.itemname === 'Ultra Fish') {
            this.ultraFishQty = item.itemqty
          }
        })
      })
      .catch((error) => {
        console.error('Error fetching user inventory:', error)
      })
  }
}
</script>

<style scoped>
.shop-container {
  height: fit-content;
  background-color: #d2691e;
  border-radius: 10px;
  border: solid 0.5px brown;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 10px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #eec0c2;
  padding: 20px;
  border-radius: 5px;
  width: 80%;
  max-width: 600px;
  font-family: 'Jersey 25', sans-serif;
  position: relative;
}

.quantity-selector {
  display: flex;
  align-items: center;
  border: 1px solid lightgray;
  border-radius: 5px;
  padding: 5px;
  width: 100px;
  justify-content: space-between;
  background-color: wheat;
  margin: 10px 0;
}

.quantity-selector button {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  outline: none;
}

.quantity-selector input {
  width: 30px;
  text-align: center;
  border: none;
  font-size: 1.2rem;
  background: transparent;
}

input[type='number']::-webkit-outer-spin-button,
input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type='number'] {
  -moz-appearance: textfield;
}
</style>
