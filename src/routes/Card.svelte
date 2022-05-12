<script></script>

<div class="outer">
  <div class="inner">
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
</style>
