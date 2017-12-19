<template>
  <v-container>
    <v-layout row wrap>
      <v-flex d-flex sm6>
        <v-card color="red lighten-2" dark tile flat>
          <v-card-text
            v-text="lorem.slice(0, 100)">
          </v-card-text>
        </v-card>
      </v-flex>
      <v-flex d-flex sm6>
        <v-layout row wrap>
          <v-flex d-flex>
            <v-flex d-flex>
              <v-card color="orange lighten-2" tile flat>
                <v-card-text
                  v-text="lorem.slice(0, 90)">
                </v-card-text>
              </v-card>
            </v-flex>
            <v-flex d-flex>
              <v-card color="red lighten-2" dark tile flat>
                <v-card-text
                  v-text="lorem.slice(0, 100)">
                </v-card-text>
              </v-card>
            </v-flex>
          </v-flex>
          <v-flex d-flex>
            <v-layout row>
              <v-flex
                d-flex
              >
                <v-card
                  color="amber lighten-2"
                  tile
                  flat
                >
                  <v-card-text
                    v-text="lorem.slice(0, 40)">
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data: () => ({
      lorem: `Lorem ipsum dolor sit amet, mel at clita quando. 
      Te
      Te\n
      Te\n
       sit oratio vituperatoribus, nam ad ipsum posidonium mediocritatem, explicari dissentiunt cu mea. Repudiare disputationi vim in, mollis iriure nec cu, alienum argumentum ius ad. Pri eu justo aeque torquatos.`
    })
  }
</script>