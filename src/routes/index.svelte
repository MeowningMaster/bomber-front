<script lang="ts">
  import Card from "$components/Card.svelte";
  import RoomCard from "$components/RoomCard.svelte";
  import { setupSocket } from "$lib/socket";
  import { onMount } from "svelte";

  onMount(function () {
    setupSocket();
  });

  type Room = {
    code: string;
  };

  const rooms: Room[] = [{ code: "NGI8X" }];
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
  <div class="header">Header</div>
  <div class="content">
    <div class="row">
      <Card title={"Join room"}>
        <form>
          <label>Code <input id="join-code" /></label>
          <input type="submit" value="Join" />
        </form>
      </Card>
      <Card title={"Create room"}>
        <form>
          <label>Name <input id="create-name" /></label>
          <label>Private <input id="create-private" type="checkbox" /></label>
          <input type="submit" value="Create" />
        </form>
      </Card>
    </div>

    <div class="rooms-list">
      {#each rooms as { code }}
        <RoomCard {code} />
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
    background: #e9ad76;
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
