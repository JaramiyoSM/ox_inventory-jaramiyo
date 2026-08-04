-- =====================================================================
--  Jaramiyo inventory actions — client
--  Two extra actions for the inventory action menu:
--    · toggle hair  (native, no framework needed)
--    · multi-job    (bridges the NUI to the server; ESX / Qbox)
--  The server owns every multi-job decision and revalidates it, because a
--  NUI can be tampered with — the client only relays.
-- =====================================================================

-- Toggle the ped's hair on and off. Instant and fail-safe: it simply stores
-- the current hair (drawable + texture) and puts it back, so it can never get
-- stuck. Component 2 is hair; (0, 0) is the bald variation.
local savedHair

RegisterNUICallback('jrmyToggleHair', function(_, cb)
    cb(1)

    local ped = cache.ped or PlayerPedId()

    if savedHair then
        SetPedComponentVariation(ped, 2, savedHair.drawable, savedHair.texture, 0)
        savedHair = nil
    else
        savedHair = {
            drawable = GetPedDrawableVariation(ped, 2),
            texture = GetPedTextureVariation(ped, 2),
        }
        SetPedComponentVariation(ped, 2, 0, 0, 0)
    end
end)

-- Multi-job: the window asks for the list when it opens.
RegisterNUICallback('jrmyMultijobGet', function(_, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobGet', false) or { active = '', jobs = {}, max = 3 })
end)

RegisterNUICallback('jrmyMultijobSwitch', function(data, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobSwitch', false, data.job) and 1 or 0)
end)

RegisterNUICallback('jrmyMultijobLeave', function(data, cb)
    cb(lib.callback.await('ox_inventory:jrmyMultijobLeave', false, data.job) and 1 or 0)
end)
