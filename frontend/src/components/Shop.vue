<!-- Shop.vue -->
<template>
  <div class="shop-section">
    <h4>The Shopkeeper...</h4>
    <div class="shop-container">
      <img src="../assets/shop/storekeeper.gif" width="150px" height="150px" />
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

        <!-- Quantity Selector -->
        <div v-if="selectedItem.itemname?.includes('Fish')" class="quantity-selector">
          <button @click="decreaseQty">-</button>
          <input type="number" v-model="itemqty" min="1" />
          <button @click="increaseQty">+</button>
        </div>

        <p><strong>Cost:</strong> {{ totalCost }} coins</p>

        <button v-if="canAfford" type="button" class="btn btn-primary" @click="buyItem">
          Purchase
        </button>
        <button v-else type="button" class="btn btn-danger" disabled>Not enough coins!</button>
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
      shopitems: [
        {
          itemname: 'Regular Fish',
          itemcost: 10,
          itemdesc:
            "Caught in the deep blue sea, this fish will regenerate 10 of your cat's happiness!",
          imgpath: 'src/assets/shop/fish1.png'
        },
        {
          itemname: 'Rare Fish',
          itemcost: 15,
          itemdesc:
            "Caught in the deep blue sea, this fish will regenerate 15 of your cat's happiness!",
          imgpath: 'src/assets/shop/fish2.png'
        },
        {
          itemname: 'Ultra Fish',
          itemcost: 20,
          itemdesc:
            "Caught in the deep blue sea, this fish will regenerate 20 of your cat's happiness!",
          imgpath: 'src/assets/shop/fish3.png'
        },
        {
          itemname: 'Beach',
          itemcost: 50,
          itemdesc: 'Switch up your room with this all new background!',
          imgpath: 'src/assets/shop/beach.gif'
        },
        {
          itemname: 'Christmas',
          itemcost: 110,
          itemdesc: 'Switch up your room with this all new background!',
          imgpath: 'src/assets/shop/christmas.gif'
        },
        {
          itemname: 'Park',
          itemcost: 200,
          itemdesc: 'Switch up your room with this all new background!',
          imgpath: 'src/assets/shop/park.gif'
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

          if (!this.selectedItem.itemname.includes('Fish')) {
            this.shopitems = this.shopitems.filter(
              (item) => item.itemname !== this.selectedItem.itemname
            )
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
    updateInventory(username) {
      axios
        .post('http://localhost:8000/api/inventory/add', {
          username: username,
          itemname: this.selectedItem.itemname,
          itemtype: this.selectedItem.itemname.includes('Fish') ? 'Fish' : 'Background',
          itemdesc: this.selectedItem.itemdesc,
          itemqty: this.itemqty,
          imgpath: this.selectedItem.imgpath
        })
        .then((response) => {
          console.log('Inventory updated successfully:', response.data)
        })
        .catch((error) => {
          console.error('Error updating inventory:', error)
        })
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
        const roomItems = ['TempRoom1', 'TempRoom2', 'TempRoom3']

        inventory.forEach((item) => {
          if (roomItems.includes(item.itemname)) {
            this.shopitems = this.shopitems.filter(
              (shopItem) => shopItem.itemname !== item.itemname
            )
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
  height: 400px;
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
