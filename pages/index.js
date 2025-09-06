import React, { useState, useEffect } from "react";

export default function RbxFlip() {
  const sampleMatches = [
    {
      id: "m1",
      host: "maxyb628",
      valueRange: [1400, 2000],
      value: 1500,
      status: "open",
      items: [],
      createdAt: Date.now() - 1000 * 60 * 30,
    },
    {
      id: "m2",
      host: "Rephyrr",
      valueRange: [26400, 27000],
      value: 26500,
      status: "open",
      items: [],
      createdAt: Date.now() - 1000 * 60 * 90,
    },
  ];

  const [matches, setMatches] = useState(() => {
    try {
      const raw = localStorage.getItem("rf_matches_v1");
      return raw ? JSON.parse(raw) : sampleMatches;
    } catch (e) {
      return sampleMatches;
    }
  });

  const [showCreate, setShowCreate] = useState(false);
  const [filterOpen, setFilterOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedMatch, setSelectedMatch] = useState(null);

  const [newHost, setNewHost] = useState("");
  const [minValue, setMinValue] = useState(100);
  const [maxValue, setMaxValue] = useState(500);
  const [targetValue, setTargetValue] = useState(300);

  useEffect(() => {
    localStorage.setItem("rf_matches_v1", JSON.stringify(matches));
  }, [matches]);

  function createMatch(e) {
    e.preventDefault();
    const id = "m" + Math.random().toString(36).slice(2, 9);
    const match = {
      id,
      host: newHost || "anon",
      valueRange: [Number(minValue), Number(maxValue)],
      value: Number(targetValue),
      status: "open",
      items: [],
      createdAt: Date.now(),
    };
    setMatches((s) => [match, ...s]);
    setShowCreate(false);
  }

  function joinMatch(matchId, joiningItems = []) {
    setMatches((s) =>
      s.map((m) =>
        m.id === matchId ? { ...m, status: "joined", items: joiningItems } : m
      )
    );
    setSelectedMatch(null);
  }

  const visibleMatches = matches.filter((m) => {
    if (!query) return true;
    return (
      m.host.toLowerCase().includes(query.toLowerCase()) ||
      String(m.value).includes(query)
    );
  });

  const sampleInventory = [
    { id: "i1", name: "Gem (rare)", value: 500 },
    { id: "i2", name: "Dog (pet)", value: 300 },
    { id: "i3", name: "Shield (epic)", value: 900 },
    { id: "i4", name: "Sword (legend)", value: 2300 },
    { id: "i5", name: "Coin bundle", value: 150 },
  ];

  const [joiningItems, setJoiningItems] = useState([]);

  function toggleItem(id) {
    setJoiningItems((s) => {
      if (s.includes(id)) return s.filter((x) => x !== id);
      return [...s, id];
    });
  }

  function getJoiningValue() {
    return joiningItems.reduce((acc, id) => {
      const it = sampleInventory.find((x) => x.id === id);
      return acc + (it ? it.value : 0);
    }, 0);
  }

  function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4">
      <header className="max-w-6xl mx-auto flex items-center justify-between py-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-tr from-indigo-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
            RF
          </div>
          <div>
            <h1 className="text-xl font-bold">RbxFlip</h1>
            <div className="text-sm text-gray-500">
              Create or join value matches
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search host or value"
            className="px-3 py-2 border rounded-md text-sm"
          />
          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
            onClick={() => setShowCreate(true)}
          >
            Create Match
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto mt-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <aside className="lg:col-span-1 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold">Filters</h3>
            <button
              className="text-sm text-indigo-600"
              onClick={() => setFilterOpen((s) => !s)}
            >
              {filterOpen ? "Hide" : "Show"}
            </button>
          </div>
        </aside>

        {/* Matches */}
        <section className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleMatches.map((m) => (
              <div
                key={m.id}
                className="bg-white p-4 rounded-lg shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm text-gray-500">Host</div>
                    <div className="font-semibold">{m.host}</div>
                    <div className="text-xs text-gray-400">
                      Created {timeAgo(m.createdAt)}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm text-gray-500">Value</div>
                    <div className="text-lg font-bold">
                      {m.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-400">
                      ({m.valueRange[0]} - {m.valueRange[1]})
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Status: <span className="font-medium">{m.status}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedMatch(m)}
                      className="px-3 py-1 border rounded text-sm"
                    >
                      View / Join
                    </button>
                    <button
                      onClick={() =>
                        setMatches((s) => s.filter((x) => x.id !== m.id))
                      }
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <form
            onSubmit={createMatch}
            className="bg-white w-full max-w-lg p-6 rounded-lg"
          >
            <h2 className="text-lg font-semibold">Create Match</h2>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <label className="col-span-2">
                Host
                <input
                  value={newHost}
                  onChange={(e) => setNewHost(e.target.value)}
                  placeholder="username"
                  className="w-full px-3 py-2 border rounded mt-1"
                />
              </label>
              <label>
                Min value
                <input
                  value={minValue}
                  onChange={(e) => setMinValue(e.target.value)}
                  type="number"
                  className="w-full px-3 py-2 border rounded mt-1"
                />
              </label>
              <label>
                Max value
                <input
                  value={maxValue}
                  onChange={(e) => setMaxValue(e.target.value)}
                  type="number"
                  className="w-full px-3 py-2 border rounded mt-1"
                />
              </label>
              <label className="col-span-2">
                Target value
                <input
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  type="number"
                  className="w-full px-3 py-2 border rounded mt-1"
                />
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Match Detail Drawer */}
      {selectedMatch && (
        <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-lg z-50 overflow-auto">
          <div className="p-4 border-b flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500">Match</div>
              <div className="font-semibold">{selectedMatch.host}</div>
            </div>
            <button
              className="text-gray-500"
              onClick={() => {
                setSelectedMatch(null);
                setJoiningItems([]);
              }}
            >
              Close
            </button>
          </div>

          <div className="p-4">
            <div className="text-sm text-gray-600">
              Value target:{" "}
              <span className="font-semibold">
                {selectedMatch.value.toLocaleString()}
              </span>
            </div>

            <hr className="my-4" />

            <h4 className="font-semibold">Select items to join</h4>
            <div className="mt-2 grid grid-cols-1 gap-2">
              {sampleInventory.map((it) => (
                <label
                  key={it.id}
                  className={`flex items-center justify-between p-2 border rounded ${
                    joiningItems.includes(it.id) ? "ring-2 ring-indigo-300" : ""
                  }`}
                >
                  <div>
                    <div className="font-medium">{it.name}</div>
                    <div className="text-xs text-gray-500">
                      Value: {it.value.toLocaleString()}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={joiningItems.includes(it.id)}
                    onChange={() => toggleItem(it.id)}
                  />
                </label>
              ))}
            </div>

            <div className="mt-4 border-t pt-3">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">Your selected value</div>
                <div className="font-semibold">
                  {getJoiningValue().toLocaleString()}
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => {
                    setSelectedMatch(null);
                    setJoiningItems([]);
                  }}
                  className="px-3 py-2 border rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={() => joinMatch(selectedMatch.id, joiningItems)}
                  className="px-3 py-2 bg-indigo-600 text-white rounded"
                >
                  Join Match
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="max-w-6xl mx-auto mt-8 text-sm text-gray-500">
        <div className="p-4">
          Demo RbxFlip UI. Hook up a backend for live matches.
        </div>
      </footer>
    </div>
  );
}
