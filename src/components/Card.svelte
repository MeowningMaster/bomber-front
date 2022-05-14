<script lang="ts">
  export let title = "Card title";
</script>

<div class="outer">
  <div class="inner">
    <div class="card-title">{title}</div>
    <slot />
  </div>
</div>

<style>
  .outer {
    border: 4px dashed #cdb196;
    box-sizing: border-box;
    border-radius: 15px;
    margin: 15px;
    padding: 8px;
  }

  .inner {
    background: #ecceb2;
    border-radius: 15px;
    padding: 15px;
  }

  .card-title {
    text-align: center;
    font-size: 2.4rem;
    margin: 0 4px 8px 4px;
  }
</style>
