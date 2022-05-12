<script lang="ts">
  import Card from "./Card.svelte";
</script>

<div class="wrapper">
  <div class="header">
    Header
    <div class="rounds" />
  </div>
  <div class="row">
    <Card>
      <span />
    </Card>
    <Card>
      <span />
    </Card>
  </div>
</div>

<style>
  :global(body) {
    background: #665546;
    margin: 0;
  }

  .wrapper {
    background: #f6e4d4;
    max-width: 800px;
    min-height: 100vh;
    margin: 0 auto;
    padding-bottom: 15px;
  }

  .header {
    background: #e9ad76;
    height: 300px;
    position: relative;
  }

  .rounds {
    width: 100%;
    background: #f6e4d4;
    position: absolute;
    bottom: 0;
    border-radius: 35px 35px 0 0;
    height: 35px;
  }

  .row {
    display: flex;
    justify-content: space-evenly;
  }
</style>
