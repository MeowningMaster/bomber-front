<script lang="ts">
  import type { Table } from "$lib/table";

  export let table: Table;
  $: status = table.gameInProgress ? "Гра триває" : "Очікування гравців";
  $: playersCount = table.players.length;
</script>

<div class="card">
  <div class="status">{status}</div>
  <div class="card-content">
    <div class="id">{table.id}</div>
    <div class="name">{table.name}</div>
    <div class="playersCount">{playersCount}</div>
  </div>
</div>

<style>
  .card {
    width: fit-content;
    min-width: 200px;
    background-color: #f5aa64;
    border: 3px solid #654b33;
    border-radius: 24px;
    box-shadow: 0 4px 4px #00000040;
    padding: 8px;
    position: relative;
    margin-top: 28px;
    cursor: pointer;
  }

  .status {
    top: -28px;
    left: 50%;
    transform: translate(-50%, 0);
    position: absolute;
    background-color: #654b33;
    color: #ffffff;
    padding: 4px 16px;
    border-radius: 16px 16px 0 0;
    white-space: nowrap;
  }

  .card-content {
    display: flex;
    border: 2px dashed #654b33;
    border-radius: 20px;
    padding: -20px;
    overflow: hidden;
  }

  .name {
    flex-grow: 1;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  }

  .id,
  .playersCount {
    flex-shrink: 1;
    height: 50px;
    text-align: center;
    writing-mode: vertical-rl;
    rotate: -180deg;
    background-color: #ffcb9b;
    padding: 4px;
    color: #e5af7d;
  }
</style>
