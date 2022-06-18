<script lang="ts">
  import { goto } from "$app/navigation";

  import Card from "$components/Card.svelte";
  import TableCard from "$components/TableCard.svelte";
  import { actions } from "$lib/actions";
  import { getSocketInstance } from "$lib/socket";
  import { onMount } from "svelte";
  import type { Table } from "$lib/table";

  function openTable(roomId: string) {
    goto(`/table/${roomId}`, { replaceState: true });
  }

  let tables: Array<Table> = [];

  onMount(async function () {
    const socket = await getSocketInstance();
    const response = (await socket.sendInstant(actions.getTableList)) as {
      tables: Array<Table>;
    };
    tables = response.tables;
    console.log("tables", tables);
  });
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="true" />
  <link
    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
    rel="stylesheet"
  />
</svelte:head>

<div class="wrapper">
  <div class="header">
    <img src="images/header.svg" alt="header" />
  </div>
  <div class="content">
    <div class="row">
      <Card title={"Приєднатися"}>
        <form>
          <label>Код кімнати <input id="join-code" /></label>
          <input type="submit" value="Приєднатися" />
        </form>
      </Card>
      <Card title={"Створити кімнату"}>
        <form>
          <label>Назва <input id="create-name" /></label>
          <label>Приватна <input id="create-private" type="checkbox" /></label>
          <input type="submit" value="Створити" />
        </form>
      </Card>
    </div>

    <div class="rooms-list">
      {#each tables as table}
        <TableCard {table} />
      {/each}
    </div>
  </div>
</div>

<style>
  :global(html) {
    font-size: 10px;
    font-family: "Roboto", sans-serif;
    color: #604832;
  }

  :global(body) {
    background: #665546;
    margin: 0;
    font-size: 1.6em;
  }

  :global(input) {
    padding: 4px 8px;
  }

  :global(input:not([type]), input[type="text"]) {
    background-color: #fbeee2;
    border: 1px solid #665546;
    border-radius: 15px;
  }

  :global(input[type="button"], input[type="submit"]) {
    background-color: #bdd337;
    border: 1px solid #8b9a2b;
    border-radius: 35px;
    box-shadow: 0 4px 4px #00000040;
  }

  .wrapper {
    background: #ffb17a;
    max-width: 800px;
    min-height: 100vh;
    margin: 0 auto;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }

  .header {
    height: 300px;
  }

  form > label {
    display: block;
  }

  .content {
    background: #f6e4d4;
    border-radius: 35px 35px 0 0;
    flex-grow: 1;
    padding: 16px;
  }

  .row {
    display: grid;
    justify-content: space-evenly;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
</style>
