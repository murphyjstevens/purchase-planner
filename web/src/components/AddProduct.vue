// <template>
//   <div class="modal fade" id="exampleModal" ref="modal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//     <div class="modal-dialog">
//       <div class="modal-content">
//         <div class="modal-header">
//           <h5 class="modal-title" id="exampleModalLabel">Add Project</h5>
//           <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
//         </div>
//         <div class="modal-body">
//           <div class="container-fluid">
//             <div class="row gy-3">
//               <div class="col-sm-12">
//                 <label for="dialog-name" class="form-label">Name</label>
//                 <input v-model="name"
//                   type="text"
//                   id="dialog-name"
//                   class="form-control"
//                   :class="{ 'is-invalid': v$.name.$error }"
//                   placeholder="Name"
//                   maxlength="100"
//                   @blur="v$.name.$touch">
//                 <div class="input-errors" v-for="error of v$.name.$errors" :key="error.$uid">
//                   <div class="error-msg invalid-feedback d-block">{{ error.$message }}</div>
//                 </div>
//               </div>
//               <div class="col-sm-12">
//                 <label for="dialog-description" class="form-label">Description</label>
//                 <textarea v-model="description"
//                   id="dialog-description"
//                   class="form-control"
//                   maxlength="500"></textarea>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div class="modal-footer">
//           <button type="button"
//             class="btn btn-primary"
//             :disabled="!v$.$dirty || v$.$invalid"
//             @click="save()">Save</button>
//           <button type="button"
//             class="btn btn-secondary"
//             @click="close()">Close</button>
//         </div>
//       </div>
//     </div>
//   </div>
// </template>

// <script>
// import { Modal } from 'bootstrap'
// import useVuelidate from '@vuelidate/core'
// import { required } from '@vuelidate/validators'
// export default {
//   name: 'AddProject',
//   data () {
//     return {
//       modal: undefined,
//       name: '',
//       description: ''
//     }
//   },
//   setup () {
//     return { v$: useVuelidate() }
//   },
//   mounted () {
//     this.modal = new Modal(this.$refs.modal, {})
//   },
//   methods: {
//     open () {
//       this.modal.show()
//       this.reset()
//     },
//     close () {
//       this.modal.hide()
//     },
//     reset () {
//       this.name = null
//       this.description = null
//       this.$nextTick(() => {
//         this.v$.$reset()
//       })
//     },
//     async save () {
//       if (this.v$.invalid) {
//         return
//       }
//       await this.$store.dispatch('projects/create', { name: this.name, description: this.description })
//       this.close()
//     }
//   },
//   validations () {
//     return {
//       name: { required }
//     }
//   }
// }
// </script>

// <style scoped lang="scss">
//   textarea {
//     resize: none;
//   }
// </style>