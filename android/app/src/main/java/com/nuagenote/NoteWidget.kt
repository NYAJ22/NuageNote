package com.nuagenote

import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.widget.RemoteViews

class NoteWidget : AppWidgetProvider() {
    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            val views = RemoteViews(context.packageName, R.layout.widget_note)
            val lastNote = getLastNote(context) // une fonction que tu définis
            views.setTextViewText(R.id.noteTextView, "quelque chose")


            appWidgetManager.updateAppWidget(appWidgetId, views)
        }
    }

    private fun getLastNote(context: Context): String {
        // Remplacer ça par une vraie récupération (SharedPreferences, BDD, etc.)
        val prefs = context.getSharedPreferences("NoteData", Context.MODE_PRIVATE)
        return prefs.getString("last_note", "Aucune note") ?: "Aucune note"
    }
}
