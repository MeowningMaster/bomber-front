<script lang="ts">
  import { goto } from "$app/navigation";

  import Card from "$components/Card.svelte";
  import TableCard from "$components/TableCard.svelte";
  import { getSocketInstance, GameSocket } from "$lib/socket";
  import { onMount } from "svelte";
  import type { Table } from "$lib/table";
  import { extractFormData } from "$lib/extract-form-data";
  import { persist, localStorage } from "@macfja/svelte-persistent-store";
  import { writable } from "svelte/store";
  import { generatePlayerName } from "$lib/player-name-generator";

  let playerName = writable("");

  let socket: GameSocket;

  function openTable(roomId: string) {
    goto(`/table/${roomId}`);
  }

  function createTable(event: SubmitEvent) {
    if (socket) {
      const data = extractFormData<{ name: string /*private?: "on"*/ }>(
        event.target as HTMLFormElement
      );
      if (socket.createTable($playerName, data.name)) {
        openTable("XFSD");
      } else {
        alert("Error during table creation");
      }
    }
  }

  let tables: Array<Table> = [];

  let updateTables = async () => {};

  onMount(async function () {
    playerName = persist(playerName, localStorage(), "playerName");
    if ($playerName === "") {
      playerName.set(generatePlayerName());
    }

    socket = await getSocketInstance();

    updateTables = async () => {
      tables = await socket.getTableList();
    };
    // setInterval(updateTables, 5000);
    // immediate upadate
    updateTables();
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
      <!-- <Card title={"Приєднатися"}>
        <form>
          <input id="join-code" placeholder="Код кімнати" />
          <input type="submit" value="Приєднатися" />
        </form>
      </Card> -->
      <Card title={"Нікнейм"}>
        <input id="player-name" bind:value={$playerName} />
      </Card>
      <Card title={"Створити кімнату"}>
        <form on:submit|preventDefault={(event) => createTable(event)}>
          <input id="create-name" name="name" placeholder="Назва кімнати" />
          <!-- <label
            >Приватна <input
              id="create-private"
              type="checkbox"
              name="private"
            /></label
          > -->
          <input type="submit" value="Створити" />
        </form>
      </Card>
    </div>

    <button on:click={() => updateTables()}>Update</button>
    <div class="rooms-list">
      {#each tables as table}
        <div on:click={() => openTable(table.id)}>
          <TableCard {table} />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  input {
    box-sizing: border-box;
    width: 100%;
    margin: 2px auto;
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

  .rooms-list {
    display: grid;
    justify-content: space-between;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
</style>
