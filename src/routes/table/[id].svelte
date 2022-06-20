<script lang="ts">
  import { page } from "$app/stores";
  import Player from "$components/Player.svelte";
  import type { GameSocket } from "$lib/socket";
  import { getSocketInstance } from "$lib/socket-store";
  import type { Table } from "$lib/table";
  import { onMount } from "svelte";
  import { writable } from "svelte/store";
  import { persist, localStorage } from "@macfja/svelte-persistent-store";
  import { goto } from "$app/navigation";
  import { replyActions, requestActions } from "$lib/actions";

  export let tableId = $page.params.id;

  let socket: GameSocket;
  let playerName = writable("");
  let table: Table;
  let myTable: Table | undefined;
  let tableLoading = true;

  async function loadTable() {
    const tables = await socket.getTableList();
    table = tables.find((x) => x.id === tableId);
    if (!table) {
      tableLoading = false;
    }
  }

  async function gameEnded() {
    table.gameInProgress = false;
  }

  onMount(async () => {
    playerName = persist(playerName, localStorage(), "playerName");

    socket = await getSocketInstance();
    await loadTable();

    myTable = await socket.getMyTable();

    socket.emmiter.on(
      replyActions.gameStarted,
      async ({ current_player, required_letters, syllable }) => {
        table.currentPlayer = current_player;
        table.currentSyllable = syllable;
        table.gameInProgress = true;
      }
    );

    socket.emmiter.on(
      replyActions.lifeEarned,
      async ({ player_id, new_required_letters }) => {
        await loadTable();
      }
    );

    socket.emmiter.on(replyActions.playerJoined, async ({}) => {
      await loadTable();
    });

    socket.emmiter.on(replyActions.playerLeft, async ({}) => {
      await loadTable();
    });

    socket.emmiter.on(
      replyActions.timeHasRunOut,
      async ({
        new_syllable,
        new_syllable_complexity,
        next_player,
        possible_word,
      }) => {
        loadTable();
        if (new_syllable_complexity === -1) {
          gameEnded();
        }
      }
    );

    socket.emmiter.on(
      replyActions.wordAccepted,
      async ({ new_syllable, next_player }) => {
        table.currentSyllable = new_syllable;
        table.currentPlayer = next_player;
      }
    );

    socket.emmiter.on(replyActions.wordRejected, async () => {});

    socket.emmiter.on(replyActions.wordUpdated, async ({ updated_word }) => {});

    socket.emmiter.on(replyActions.tableDeleted, async () => {
      goto("/");
    });
  });

  async function joinTable() {
    const currentTable = await socket.getMyTable();
    if (currentTable) {
      const leave = confirm(`Leave table ${currentTable.name}`);
      if (leave) {
        await socket.leaveTable();
      } else {
        return;
      }
    }
    const joined = await socket.joinTable($playerName, tableId);
    if (joined) {
      await loadTable();
      myTable.id = table.id;
    } else {
      console.error("Join failed");
    }
  }

  async function leaveTable() {
    await socket.leaveTable();
    myTable = undefined;
    if (table.players.length === 1) {
      goto("/");
    } else {
      await loadTable();
    }
  }

  function startGame() {
    socket.startGame();
  }

  function deleteTable() {
    socket.deleteTable();
  }
</script>

{#if table && tableLoading}
  <div class="players">
    {#each table.players as player}
      <Player
        {player}
        host={table.host.id === player.id}
        current={table.currentPlayer?.id === player.id}
      />
    {/each}
  </div>
  <div class="controls">
    {#if table.id !== myTable?.id}
      <button on:click={() => joinTable()}>Приєднатися до столу</button>
    {:else}
      <button on:click={() => leaveTable()}>Покинути стіл</button>
      {#if table.host.name === $playerName}
        {#if !table.gameInProgress}
          <button on:click={() => startGame()}>Розпочати гру</button>
        {/if}
        <button on:click={() => deleteTable()}>Закрити стіл</button>
      {/if}
    {/if}
    <span>Стан: {table.gameInProgress ? "Гра триває" : "Гру не розпочато"}</span
    >
    <span>Syllable: {table.currentSyllable}</span>
    <div>
      <input placeholder="Слово" />
    </div>
  </div>
{:else}
  <div class="table-loading">
    {tableLoading ? "Завантаження..." : "Стіл не знайдено"}
  </div>
{/if}

<style>
  .table-loading {
    color: white;
  }

  .players {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    padding: 50px;
    gap: 30px;
  }

  .controls {
    position: fixed;
    bottom: 0;
    padding: 10px;
    color: white;
  }
</style>
